// @ts-nocheck

class Plugin {
	async start() {
		super.start({
			before: {
				default: {
					MessageContextMenu: {
						selector: "MessageContextMenu",
						callback: this.onMessageContext,
						isContextMenu: true
					},
					GuildsList: "GuildsBar",
					TextChannel: ["crosspostMessage"]
				}
			},
			instead: {
				default: {
					HomeButton: {},
					GuildMember: {
						selector: "MemberItem",
					}
				}
			},
			after: {
				render: [
					/*UserPopout*/ {
						selector: "UserPopout",
						callback: "popout",
						isModal: true
					},
					"UserBanner",
					["FormItem", "FormTextInput"],
				]
			}
		})
	}

	afterUserPopout() {} // after default UserPopout
	beforeSendMessage() {} // before default [sendMessage]
	afterUserProfileBadgeListRender() {} // after render UserProfileBadgeList

	patchUserPopout() {} // from config - after render UserPopout
	patchHomeButton() {} // from config - instead default HomeButton
	onMessageContext() {} // from config - before default MessageContextMenu
	patchGuildList() {} // from config - after render GuildsBar
}

export default function initializePatches(plugin: DumbPlugin, config: PatcherConfig = {} as any) {
    const patches = [];
    const patchTypes = Object.keys(config); //["before", "instead", "after"];
    
    // If config != {}
    for (const patchTypeKey of patchTypes) { // "before" | "instead" "after"
        const patchType: Object = config[patchTypeKey] // { default, render }
        for (const methodKey of Object.keys(patchType)) { // "default" | "render"
            const method: Object | Array<PatchOption | string> = patchType[methodKey];

            // method is Array<PatchOption | string | Array<string>> && after
            if (method instanceof Array) {
                // PatchOption | string | Array<string>
                for (const methodProp of method) {
                    const option = getPatchOption(plugin, method, methodProp);
                    patches.push(await patch(plugin, option, patchTypeKey, methodKey))
                }
            }
            // method is Object && before/instead
            else {
                // "MessageContextMenu", "GuildsList", "HomeButton"
                for (const methodPropKey of method) {
                    const methodProp: Object | string | PatchOption | Array<string> = method[methodPropKey];
                    const option = getPatchOption(plugin, method, methodProp, methodPropKey);
                    patches.push(await patch(plugin, option, patchTypeKey, methodKey))
                }
            }
        }
    }

    // properties in plugin that starts with "before" | "instead" | "after" - case sensitive
    const pluginPropKeys = Object.keys(plugin).filter(key => patchTypes.some(type => key.startsWith(type)));
    for (const pluginPropKey of pluginPropKeys) {
        const pluginProp: Function | any = plugin[pluginPropKey];
        if (!(pluginProp instanceof Function)) continue; // property is not intended for module patching

        const pluginPropName = pluginPropKey.replace(/^before|instead|after/, '');
        const moduleGuesses = await findModuleByGuessing(pluginProp, pluginPropName);

        // Found 0 or too many modules
        if (moduleGuesses.length != 1) {
            if (!moduleGuesses.length) plugin.logger.warn("No module guesses for", pluginPropKey);
            else if (moduleGuesses.length > 1) plugin.logger.warn("Multiple module guesses for", pluginPropKey, moduleGuesses);
            continue;
        }

        const { module, option, method } = moduleGuesses[0];
        patches.push(await patch(plugin, option, method, pluginPropName, module));
    }

    return patches.filter(patch => patch);
}

function getSelector(methodProp: {} | string | Array<string> | PatchOption): string | Array<string> {
    if (methodProp instanceof String || methodProp instanceof Array) return methodProp; // UserBanner || [crosspostMessage], [FormItem, FormTextInput]
    else if ('selector' in methodProp) return methodProp.selector; // UserPopout
    return propName; // HomeButton
}
/**
 * @returns patchPropName ?? patchMethodProp ?? patchMethodProp[0]Module - patchTextChannel ?? patchMessageContextMenu ?? patchFormItemModule
 */
function getCallback(plugin: DumbPlugin, methodProp: {} | string | Array<string> | PatchOption, selector: string, propName?: string): Function {
    if (methodProp instanceof String) return plugin[`patch${propName ?? selector}`]; // patchGuildsList ?? patchUserBanner
    else if (methodProp instanceof Array) return plugin[`patch${propName ?? methodProp[0].charAt(0).toUpperCase() + methodProp[0].slice(1)}Module`]; // patchTextChannel ?? patchFormItemModule
    
    const callbackResolvable: string | Function | undefined = methodProp.callback;
    if (!callbackResolvable) return plugin[`patch${propName ?? selector}`]; // patchGuildMember ?? patchMemberItem
    else if (callbackResolvable instanceof Function) return callbackResolvable; // (...args) => { ... } | plugin.onMessageContext
    return plugin[callbackResolvable]; // plugin.popout
}
function getPatchOption(plugin: DumbPlugin, method: Object | Array<PatchOption | string>, methodProp: {} | string | Array<string> | PatchOption, methodPropKey?: string): PatchOption {
    const selector = getSelector(method, methodProp);
    const callback: Function = getCallback(plugin, methodProp, selector, methodPropKey).bind(plugin);
    const options = methodProp instanceof Object ? methodProp : {};

    return {
        selector,
        callback,
        ...options
    }
}
async function findModule(option: PatchOption): Promise<Module> {
    return option.isModal || option.isContextMenu ? waitForModule(option) : getModule(option);
}
async function getModule(option: PatchOption): Promise<Module> {
    return Finder.query({ [option.selector instanceof Array ? "props" : "name"]: option.selector }) ??
        Finder.query({ props: [option.selector] })
}
async function patch(plugin: DumbPlugin, option: PatchOption, patchType: string, methodType: string, module?: Module) {
    module ??= await findModule(option);
    if (!module) {
        plugin.logger.warn("Module not found for", option.selector);
        return null;
    }

    const previouslyPatched = plugin.patches.find(p => p.module === module && p.method === method && p.patchType === patchType);
    if (previouslyPatched && !option.override) {
        return previouslyPatched;
    }

    const callback = (data: any) => {
        try { option.callback(data) }
        catch (e) { console.error(e) }
    }

    const cancel = plugin.patcher[patchType](module, methodType, callback, option);
    const patched = { module, callback, method: methodType, patch: patchType, option, cancel };
    // Patched after render UserPopout bound to plugin.afterUserPopout.
    if (!option.silent) plugin.logger.log(`Patched ${patchType} ${methodType} ${option.selector} bound to ${option.callback.name}.`);
    return patched;
}

type PatchOptionAndMethod = PatchOption & { method: string };
async function findModuleByGuessing(pluginProp: Function, pluginPropName: string): Promise<Array<PatchOptionAndMethod>> {

    return Promise.all((() => {
        // after default UserPopout
        const defaultModule: PatchOptionAndMethod = {
            method: "default",
            selector: pluginPropName,
            callback: pluginProp
        }
        // Is it possible to have a module with camelCase displayName?
        // before default sendMessage
        const defaultModuleProps: PatchOptionAndMethod = {
            method: "default",
            selector: [pluginPropName.charAt(0).toUpperCase() + pluginPropName.slice(1)],
            callback: pluginProp
        }
        // after render UserProfileBadgeList
        // define method as last sequence of letters after a capital letter
        const renderModule = pluginPropName.match(/[A-Z]{1}[a-z]+$/).reduce((_, method) => ({
            method,
            selector: pluginPropName.replace(method, ''),
            callback: pluginProp
        }), {} as PatchOptionAndMethod);

        return [defaultModule, defaultModuleProps, renderModule];
    })().map(({ method, ...option }) => getModule(option).then<{ module: Module, option: PatchOption, method: string }>(module => ({ module, option, method }))));
}