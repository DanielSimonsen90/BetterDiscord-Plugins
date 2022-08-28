import { Arrayable } from "danholibraryjs";
import { Finder, Patcher, Settings } from "discordium";
import { Module } from "@ZLibrary";
import { Functionable, If, PartialRecord } from "../Utils";
import Plugin from "../Plugin";

export type PatcherConfig<Settings = Record<string, any>> = PartialRecord<
    'before' | 'instead' | 'after', 
    PartialRecord<
        'default' | 'render' | string, 
        Array<PatchOptions<false, Settings>> | Record<string, PatchOptions<false, Settings>>
    >
>
export type PatchOption<ForceCbIsFunc = false, SettingsType = any> = {
    /**
     * @type {string} - displayName of the module
     * @type {Array<string>} - Properties from module
     */
    selector?: Arrayable<string>,
    /**
     * @type {string} - Name of the callback function
     * @type {Function} - Callback function instead of callback method
     * @default this[`patch${displayName}`] - this.patchUserPopout
     */
    callback?: If<ForceCbIsFunc, Function, string | Function>,
    /**
     * Module triggered by context menu
     */
    isContextMenu?: boolean,
    /**
     * Module triggered by modal
     */
    isModal?: boolean,
    /**
     * If already patched, should override?
     */
    override?: boolean,
    /**
     * Don't log in conosle
     */
    silent?: boolean,
    /**
     * Run this patch once, then cancel
     */
    once?: boolean,
    /**
     * Patch if condition is true - useful for settings
     */
    condition?: Functionable<boolean, [Settings<SettingsType, { settings: SettingsType }>['current']]>,
}
export type PatchOptions<ForceCbIsFunc = false, Settings = Record<string, any>> = PatchOption<ForceCbIsFunc, Settings> | Arrayable<string>
export type PatchOptionAndMethod<
    ForceCbIsFunc = false,
    IncludeModule extends boolean = false
> = PatchOption<ForceCbIsFunc> & Pick<Patched, "method"> & If<IncludeModule, { module: Module }, {}>
export type PatchOptionAndCallbackName = PatchOption<true> & { callbackName?: string }
export type Patched = {
    module: Module,
    callback: Function,
    method: keyof PatcherConfig[keyof PatcherConfig],
    patchType: keyof PatcherConfig,
    option: PatchOptions
    cancel: Function
}

type DumbPlugin<Settings = Record<string, any>> = Pick<Plugin<Settings>, 'patcher' | 'logger' | 'patches' | 'settings'>

const defaultOptions: Partial<PatchOptions> = {
    isContextMenu: false,
    isModal: false,
    once: false,
    override: false,
    silent: false,
    condition: true
}

export default async function initializePatches<Settings>(plugin: DumbPlugin<Settings>, config: PatcherConfig<Settings> = {} as any) {
    const patches = [];
    let patchTypes = Object.keys(config); //["before", "instead", "after"];

    // If config != {}
    for (const patchTypeKey of patchTypes) { // "before" | "instead" "after"
        const patchType: Object = config[patchTypeKey] // { default, render }
        for (const methodKey of Object.keys(patchType)) { // "default" | "render"
            const method: Object | Array<PatchOption | string> = patchType[methodKey];

            // method is Array<PatchOption | string | Array<string>> && after
            if (method instanceof Array) {
                // PatchOption | string | Array<string>
                for (const methodProp of method) {
                    const option = getPatchOption(plugin, methodProp);
                    patches.push(await patch(plugin, option, patchTypeKey, methodKey))
                }
            }
            // method is Object && before/instead
            else {
                // "MessageContextMenu", "GuildsList", "HomeButton"
                for (const methodPropKey in method) {
                    const methodProp: Object | string | PatchOption | Array<string> = method[methodPropKey];
                    const option = getPatchOption(plugin, methodProp, methodPropKey);

                    const isConditionTrue = (condition: Functionable<boolean>) => typeof condition === 'function' ? condition(plugin.settings.current) : condition;
                    if (typeof option.condition === 'boolean' && !option.condition) continue;
                    else if (typeof option.condition === 'function' && !option.condition(plugin.settings.current)) continue;
                    else if (Array.isArray(option.condition) && option.condition.some(isConditionTrue)) continue;

                    patches.push(await patch(plugin, option, patchTypeKey, methodKey))
                }
            }
        }
    }

    // Set patchTypes, if config is {}
    patchTypes = ["before", "instead", "after"];

    // properties in plugin that starts with "before" | "instead" | "after" - case sensitive
    const pluginPropKeys = Object.keys(plugin).filter(key => patchTypes.some(type => key.startsWith(type)));

    for (const pluginPropKey of pluginPropKeys) {
        const pluginProp: Function | any = plugin[pluginPropKey];
        if (!(pluginProp instanceof Function)) {
            plugin.logger.log(`[Patcher] ${pluginPropKey} is not a function`);
            continue;
        }; // property is not intended for module patching

        const patchType = (() => {
            for (const type of patchTypes) {
                if (pluginPropKey.startsWith(type)) return type;
            }
            return "after";
        })();
        const pluginPropName = pluginPropKey.replace(/^before|instead|after/, '');
        const moduleGuesses = await findModuleByGuessing(pluginProp, pluginPropName, pluginPropKey, plugin);

        // Found 0 or too many modules
        if (moduleGuesses.length != 1) {
            if (!moduleGuesses.length) plugin.logger.warn("No module guesses for", pluginPropKey);
            else if (moduleGuesses.length > 1) plugin.logger.warn("Multiple module guesses for", pluginPropKey, moduleGuesses);
            continue;
        }

        const { module, method, ...option } = moduleGuesses[0];
        plugin.logger.log('[Patcher]: Interpreting module', {
            module, method, option, patchType, pluginPropKey
        });

        if (!module) {
            plugin.logger.warn(`[Patcher]: No module found for ${pluginPropKey}`, {
                moduleGuesses, patchType, pluginPropKey, pluginProp, option, method
            });
            continue;
        }

        patches.push(await patch(plugin, option, patchType, method, module));
    }

    return patches.filter(patch => patch);
}

function getSelector(methodProp: {} | string | Array<string> | PatchOption, propName: string): string | Array<string> {
    if (typeof methodProp === 'string' || methodProp instanceof Array) return methodProp; // UserBanner || [crosspostMessage], [FormItem, FormTextInput]
    else if ('selector' in methodProp) return methodProp.selector; // UserPopout
    return propName; // HomeButton
}
/**
 * @returns patchPropName ?? patchMethodProp ?? patchMethodProp[0]Module - patchTextChannel ?? patchMessageContextMenu ?? patchFormItemModule
 */
function getCallback(plugin: DumbPlugin, selector: Arrayable<string>, methodProp: Object | string | Array<string> | PatchOption, propName?: string): [Function, string] {
    let callbackName = "";
    if (methodProp instanceof Array || selector instanceof Array) {
        callbackName = `patch${(
            propName) ?? (typeof methodProp === 'string' ? 
            methodProp : 
            (methodProp[0] ??= selector[0]).charAt(0).toUpperCase() + methodProp[0].slice(1) + "Module")}`; // patchTextChannel ?? patchFormItemModule
        return [plugin[callbackName], callbackName];
    }
    else if (typeof methodProp === 'string' // patchGuildsList ?? patchUserBanner
        || !('callback' in methodProp)) { // patchGuildMember ?? patchMemberItem
        callbackName = `patch${propName ?? selector}`;
        return [plugin[callbackName], callbackName];
    } 

    const callbackResolvable = methodProp.callback;
    return callbackResolvable instanceof Function ? [callbackResolvable, methodProp.callback['name']] : // (...args) => { ... } | plugin.onMessageContext
        [plugin[callbackResolvable], callbackResolvable]; // plugin.popout
}
function getPatchOption(plugin: DumbPlugin,  methodProp: {} | string | Array<string> | PatchOption, methodPropKey?: string): PatchOptionAndCallbackName {
    const selector = getSelector(methodProp, methodPropKey);
    let [callback, callbackName] = getCallback(plugin, selector, methodProp, methodPropKey);
    callback = callback.bind(plugin);
    const options = methodProp instanceof Object ? methodProp : {};

    if (!callback) {
        console.error("No callback for", {plugin, methodPropKey, methodProp});
        return {};
    }

    return {
        selector,
        callback,
        callbackName,
        ...defaultOptions as any,
        ...options
    }
}

async function patch(plugin: DumbPlugin, option: PatchOptionAndCallbackName, patchType: string, methodType: string, module?: Module) {
    module ??= await findModule(plugin, option);
    if (!module) {
        plugin.logger.error("Module not found for", option.selector);
        return null;
    } else if (methodType !== 'default' && Array.isArray(option.selector)) {
        module = module[Array.isArray(option.selector) ? option.selector[0] : option.selector];
    }

    const previouslyPatched = (plugin.patches ??= []).find(p => p.module === module && p.method === methodType && p.patchType === patchType);
    if (previouslyPatched && !option.override) {
        return previouslyPatched;
    }

    const callback = (data: any) => {
        try { return option.callback(data) }
        catch (e) { 
            plugin.logger.error(e);
            throw e;
         }
    }

    const cancel = plugin.patcher[patchType](module, methodType, callback, option);
    const patched = { module, callback, method: methodType, patch: patchType, option, cancel };
    // Patched after render UserPopout bound to plugin.afterUserPopout.
    if (!option.silent) plugin.logger.log(`Patched ${patchType} ${methodType} ${option.selector} bound to ${option.callbackName}.`, patched);
    return patched;
}

async function waitForModule(patcher: Patcher, option: Exclude<PatchOptions<true>, Arrayable<string>>) {
    const { isContextMenu, isModal } = option;
    return (
        isContextMenu ? patcher.waitForContextMenu(() => getModule(option), { silent: option.silent }) : 
        isModal ? patcher.waitForModal(() => getModule(option), { silent: option.silent }) : 
        new Promise<Module>(resolve => resolve(getModule(option)))
    )
}
async function getModule(option: PatchOption<true>): Promise<Module> {
    return Finder.query({ [option.selector instanceof Array ? "props" : "name"]: option.selector }) ??
        Finder.query({ props: option.selector instanceof Array ? option.selector : [option.selector] });
}
async function findModuleByGuessing(pluginProp: Function, pluginPropName: string, pluginPropKey: string, plugin: DumbPlugin): Promise<Array<PatchOptionAndMethod<true, true>>> {
    const guesses = await Promise.all((() => {
        const sharedOption: PatchOptionAndCallbackName = {
            callback: pluginProp,
            callbackName: pluginPropKey,
            isModal: pluginPropName.includes("Modal"), 
            isContextMenu: pluginPropName.includes("ContextMenu") 
        }
        const camelCase = (val: string) => val.charAt(0).toLowerCase() + val.slice(1);

        if (pluginPropName.includes("Module")) {
            const method = camelCase(pluginPropName.replace('Module', '')); // HomeButtonModule => HomeButton
            return [{ ...sharedOption, method, selector: [method] }];
        }

        // after default UserPopout
        const defaultModule: PatchOptionAndMethod<true> = {
            ...sharedOption,
            method: "default",
            selector: pluginPropName,
        }
        // Is it possible to have a module with camelCase displayName?
        // before default sendMessage
        const defaultModuleProps: PatchOptionAndMethod<true> = {
            ...sharedOption,
            method: "default",
            selector: [camelCase(pluginPropName)],
        }
        // after render UserProfileBadgeList
        // define method as last sequence of letters after a capital letter
        const renderModule = pluginPropName.match(/[A-Z]{1}[a-z]+$/).reduce((_, method) => ({
            ...sharedOption,
            method: camelCase(method),
            selector: pluginPropName.replace(method, ''),
        }), {} as PatchOptionAndMethod<true>);

        console.log()
        return [defaultModule, defaultModuleProps, renderModule];
    })().map(({ method, ...option }) => (
        option.isContextMenu || option.isModal ? 
            waitForModule(plugin.patcher, option) : 
            getModule(option)
        ).then<PatchOptionAndMethod<true, true>>(module => ({ 
            module, method, ...option 
        }) as PatchOptionAndMethod<true, true>)));

    return guesses.filter(result => result.module && result.method !== 'invalid');
}
async function findModule(plugin: DumbPlugin, option: PatchOption<true>): Promise<Module> {
    return option.isModal || option.isContextMenu ? waitForModule(plugin.patcher, option) : getModule(option);
}