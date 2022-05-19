import { Module } from "danho-bd/libraries/ZLibrary";
import { Arrayable } from "danholibraryjs";
import { Finder, Patcher } from "discordium/api";
import { PartialRecord } from "./Utils";
import Plugin from "./Plugin";
import { PatchCallback } from "danho-bd/libraries/ZLibrary/Patcher";

export type PatcherConfig = PartialRecord<'before' | 'instead' | 'after', PartialRecord<'default' | 'render', Array<PatchOptions>>>
export type PatchOptions = {
    /**
     * @type {string} - displayName of the module
     * @type {Array<string>} - Properties from module
     */
    selector: Arrayable<string>,
    /**
     * @type {string} - Name of the callback function
     * @type {Function} - Callback function instead of callback method
     * @default this[`patch${displayName}`] - this.patchUserPopout
     */
    callback?: string | PatchCallback,

    /**
     * Module triggered by context menu
     */
    isContextMenu?: boolean,
    /**
     * Module triggered by modal
     */
    isModal?: boolean,
    // isLazy?: boolean,
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
    once?: boolean
} | Arrayable<string>
export type Patched = {
    module: Module,
    callback: Function,
    method: keyof PatcherConfig[keyof PatcherConfig],
    patchType: keyof PatcherConfig,
    option: PatchOptions
    cancel: Function
}

type DumbPlugin = Pick<Plugin<any>, 'patcher' | 'logger' | 'patches'>

const defaultOption: Partial<PatchOptions> = {
    isContextMenu: false,
    isModal: false,
    once: false,
    override: false,
    silent: false
}

export default function initializePatches(plugin: DumbPlugin, config: PatcherConfig = {} as any) {
    return configurePatches(plugin, config, async ({ patchType, method, option }) => {
        const patch = (module: Module) => commitPatch(plugin, module, { patchType, method, option });

        return optionIsArrayable(option) ? 
            patch(getModule(option)) : 
            waitForModule(plugin.patcher, option).then(patch);
    });
}

type ConfigurationLoopData = {
    patchType: keyof PatcherConfig, 
    method: keyof PatcherConfig[keyof PatcherConfig], 
    option: PatchOptions 
}

type ConfigurationCallback = (data: ConfigurationLoopData) => Promise<Patched | undefined>;
async function configurePatches(plugin: DumbPlugin, config: PatcherConfig, callback: ConfigurationCallback) {
    const patches = plugin.patches ??= new Array<Patched>();

    for (const pt in config) {
        const patchType = pt as keyof PatcherConfig;
        const methods = config[patchType];

        for (const m in methods) {
            const method = m as keyof PatcherConfig[keyof PatcherConfig];
            const options = config[patchType][method];
        
            for (const o of options) {
                const option: PatchOptions = Object.assign({}, defaultOption, o);
                const patch = await callback({ patchType, method, option });
                if (!patch) continue;

                const previouslyPatched = patches.find(p => p.module === patch.module && p.method === patch.method && p.patchType === patch.patchType);
                if (previouslyPatched) {
                    if (optionIsArrayable(option) || !option.override) continue;
                    patches.splice(patches.indexOf(previouslyPatched), 1);
                    continue;
                }

                patches.push(patch);
            }
        }
    }

    return patches;
}

function optionIsArrayable(option: PatchOptions): option is Arrayable<string> {
    return Array.isArray(option) || typeof option === 'string';
}
function getModule(selector: Arrayable<string>): Module {
    return (
        // displayName && props ? Finder.query({ name: displayName, props, }) :
        Array.isArray(selector) ? Finder.byProps(...selector) : 
        typeof selector === 'string' ? Finder.byName(selector) : 
        undefined
    );
}
function commitPatch(plugin: DumbPlugin, module: Module, { patchType, method, option }: ConfigurationLoopData): Patched {
    const selector = optionIsArrayable(option) ? option : option.selector;
    const callbackName = (() => {
        const moduleName = module.default?.displayName ? `patch${module.default.displayName}` : undefined;
        const callbackPathName = (name: Arrayable<string>) => typeof name === 'string' ? `patch${name}` : moduleName;
        const callbackExists = (callback: string | Function) => typeof callback === 'function' ? callback.name : callback;

        return !optionIsArrayable(option) && option.callback ? 
            callbackExists(option.callback) : 
            callbackPathName(optionIsArrayable(option) ? selector : option.selector);
    })();
            
    const resolvedCallback = plugin[callbackName];
    const warnings = [
        [module === undefined, `Could not find module $${typeof selector === 'string' ? `with name "${selector}"` : `with props [${selector.join(', ')}]`}`],
        [resolvedCallback === undefined, `Could not find ${
            optionIsArrayable(option) ? `"patch${selector}"` :
            typeof option.callback === 'function' ? `callback for "${selector}"` : 
            typeof option.callback === 'string' ? `"${option.callback}"` : 'callback'
        }`],
    ].forEach(([condition, message]) => {
        if (condition) plugin.logger.error(message, option);
    });

    const previouslyPatched = plugin.patches.find(p => p.module === module && p.method === method && p.patchType === patchType);
    if (previouslyPatched && (optionIsArrayable(option) || !option.override)) {
        return previouslyPatched;
    }

    const cancel = plugin.patcher[patchType as any](module, method, () => console.log('hello'), option);
    const patched = { module, callback: resolvedCallback, method, patchType, option, cancel };
    plugin.logger.log(`Patched ${patchType} ${method} on ${
        module.displayName 
        || module.default?.displayName 
        || (optionIsArrayable(option) ? typeof option === 'string' ? option : `[${option.join(', ')}]` : 
            optionIsArrayable(option.selector) ? typeof option.selector === 'string' ? option.selector : `[${option.selector.join(', ')}]` :
            callbackName)
    } and bound to ${callbackName}`, patched);
    return patched;
}
function waitForModule(patcher: Patcher, option: Exclude<PatchOptions, Arrayable<string>>) {
    const { selector, isContextMenu, isModal } = option;
    return (
        isContextMenu ? patcher.waitForContextMenu(() => getModule(selector), { silent: option.silent }) : 
        isModal ? patcher.waitForModal(() => getModule(selector), { silent: option.silent }) : 
        new Promise<Module>(resolve => resolve(getModule(selector)))
    )
}