/**
 * @name DanhoTestZerthox
 * @author Danho#2105
 * @description A plugin for testing Danho's code
 * @version 0.0.1
 * @authorLink https://github.com/Danho#2105
 * @website https://github.com/Zerthox/BetterDiscord-Plugins
 * @source https://github.com/Zerthox/BetterDiscord-Plugins/tree/master/src/DanhoTestZerthox
 * @updateUrl https://raw.githubusercontent.com/Zerthox/BetterDiscord-Plugins/master/dist/bd/DanhoTestZerthox.plugin.js
**/

/*@cc_on @if (@_jscript)
var pluginName = WScript.ScriptName.split(".")[0];
var shell = WScript.CreateObject("WScript.Shell");
shell.Popup(
    "Do NOT run scripts from the internet with the Windows Script Host!\nMove this file to your BetterDiscord plugins folder.",
    0,
    pluginName + ": Warning!",
    0x1030
);
var fso = new ActiveXObject("Scripting.FileSystemObject");
var pluginsPath = shell.expandEnvironmentStrings("%appdata%\\BetterDiscord\\plugins");
if (!fso.FolderExists(pluginsPath)) {
    var popup = shell.Popup(
        "Unable to find BetterDiscord on your computer.\nOpen the download page of BetterDiscord?",
        0,
        pluginName + ": BetterDiscord not found",
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer \"https://betterdiscord.app\"");
    }
} else if (WScript.ScriptFullName === pluginsPath + "\\" + WScript.ScriptName) {
    shell.Popup(
        "This plugin is already in the correct folder.\nNavigate to the \"Plugins\" settings tab in Discord and enable it there.",
        0,
        pluginName,
        0x40
    );
} else {
    var popup = shell.Popup(
        "Open the BetterDiscord plugins folder?",
        0,
        pluginName,
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer " + pluginsPath);
    }
}
WScript.Quit();
@else @*/

'use strict';

const createLogger = (name, color, version) => {
    const print = (output, ...data) => output(`%c[${name}] %c${version ? `(v${version})` : ""}`, `color: ${color}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
    return {
        print,
        log: (...data) => print(console.log, ...data),
        warn: (...data) => print(console.warn, ...data),
        error: (...data) => print(console.error, ...data)
    };
};

const join = (filters) => {
    const apply = filters.filter((filter) => filter instanceof Function);
    return (exports) => apply.every((filter) => filter(exports));
};
const byName$1 = (name) => {
    return (target) => target instanceof Object && target !== window && Object.values(target).some(byOwnName(name));
};
const byOwnName = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byProps$1 = (props) => {
    return (target) => target instanceof Object && props.every((prop) => prop in target);
};

const raw = {
    single: (filter) => BdApi.findModule(filter),
    all: (filter) => BdApi.findAllModules(filter) ?? []
};
const resolveExports = (target, filter) => {
    if (target) {
        if (typeof filter === "string") {
            return target[filter];
        }
        else if (filter instanceof Function) {
            return filter(target) ? target : Object.values(target).find((entry) => filter(entry));
        }
    }
    return target;
};
const find = (...filters) => raw.single(join(filters));
const byName = (name) => resolveExports(find(byName$1(name)), byOwnName(name));
const byProps = (...props) => find(byProps$1(props));

const EventEmitter = () => byProps("subscribe", "emit");
const React$1 = () => byProps("createElement", "Component", "Fragment");
const ReactDOM$1 = () => byProps("render", "findDOMNode", "createPortal");
const classNames$1 = () => find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const lodash$1 = () => byProps("cloneDeep", "flattenDeep");
const semver = () => byProps("valid", "satifies");
const moment = () => byProps("utc", "months");
const SimpleMarkdown = () => byProps("parseBlock", "parseInline");
const hljs = () => byProps("highlight", "highlightBlock");
const Raven = () => byProps("captureBreadcrumb");
const joi = () => byProps("assert", "validate", "object");

const npm = {
    __proto__: null,
    EventEmitter: EventEmitter,
    React: React$1,
    ReactDOM: ReactDOM$1,
    classNames: classNames$1,
    lodash: lodash$1,
    semver: semver,
    moment: moment,
    SimpleMarkdown: SimpleMarkdown,
    hljs: hljs,
    Raven: Raven,
    joi: joi
};

const Flux$1 = () => byProps("Store", "useStateFromStores");
const Dispatcher = () => byProps("dirtyDispatch");

const flux = {
    __proto__: null,
    Flux: Flux$1,
    Dispatcher: Dispatcher
};

const Constants = () => byProps("Permissions", "RelationshipTypes");
const i18n = () => byProps("languages", "getLocale");
const Channels = () => byProps("getChannel", "hasChannel");
const SelectedChannel = () => byProps("getChannelId", "getVoiceChannelId");
const Users = () => byProps("getUser", "getCurrentUser");
const Members = () => byProps("getMember", "isMember");
const ContextMenuActions = () => byProps("openContextMenuLazy");
const ModalActions = () => byProps("openModalLazy");
const Flex$1 = () => byName("Flex");
const Button$1 = () => byProps("Link", "Hovers");
const Text = () => byName("Text");
const Links = () => byProps("Link", "NavLink");
const Switch = () => byName("Switch");
const SwitchItem = () => byName("SwitchItem");
const RadioGroup = () => byName("RadioGroup");
const Slider = () => byName("Slider");
const TextInput = () => byName("TextInput");
const Menu = () => byProps("MenuGroup", "MenuItem", "MenuSeparator");
const Form$1 = () => byProps("FormItem", "FormSection", "FormDivider");
const margins$1 = () => byProps("marginLarge");

const discord = {
    __proto__: null,
    Constants: Constants,
    i18n: i18n,
    Channels: Channels,
    SelectedChannel: SelectedChannel,
    Users: Users,
    Members: Members,
    ContextMenuActions: ContextMenuActions,
    ModalActions: ModalActions,
    Flex: Flex$1,
    Button: Button$1,
    Text: Text,
    Links: Links,
    Switch: Switch,
    SwitchItem: SwitchItem,
    RadioGroup: RadioGroup,
    Slider: Slider,
    TextInput: TextInput,
    Menu: Menu,
    Form: Form$1,
    margins: margins$1
};

const createProxy = (entries) => {
    const result = {};
    for (const [key, value] of Object.entries(entries)) {
        Object.defineProperty(result, key, {
            enumerable: true,
            configurable: true,
            get() {
                delete this[key];
                this[key] = value();
                return this[key];
            }
        });
    }
    return result;
};
const Modules = createProxy({
    ...npm,
    ...flux,
    ...discord
});
const { React, ReactDOM, classNames, lodash, Flux } = Modules;

const resolveName = (object, method) => {
    const target = method === "default" ? object[method] : {};
    return object.displayName ?? object.constructor?.displayName ?? target.displayName ?? "unknown";
};
const createPatcher = (id, Logger) => {
    const forward = (patcher, object, method, callback, options) => {
        const original = object[method];
        const cancel = patcher(id, object, method, options.once ? (context, args, result) => {
            const temp = callback({ cancel, original, context, args, result });
            cancel();
            return temp;
        } : (context, args, result) => callback({ cancel, original, context, args, result }), { silent: true });
        return cancel;
    };
    const rawPatcher = BdApi.Patcher;
    const patcher = {
        instead: (object, method, callback, options = {}) => forward(rawPatcher.instead, object, method, ({ result: _, ...data }) => callback(data), options),
        before: (object, method, callback, options = {}) => forward(rawPatcher.before, object, method, ({ result: _, ...data }) => callback(data), options),
        after: (object, method, callback, options = {}) => forward(rawPatcher.after, object, method, callback, options),
        unpatchAll: () => {
            rawPatcher.unpatchAll(id);
            Logger.log("Unpatched all");
        },
        waitForLazy: (object, method, argIndex, callback, options) => new Promise((resolve) => {
            const found = callback();
            if (found) {
                if (!options.silent)
                    Logger.log(`Lazy load in ${method} of ${resolveName(object, method)} found from callback`, { found });
                resolve(found);
            }
            else {
                if (!options.silent)
                    Logger.log(`Waiting for lazy load in ${method} of ${resolveName(object, method)} ${(callback.name ? `and bound to ${callback.name}` : '')}`, { object, method, arg: argIndex, callback, options });
                patcher.before(object, method, ({ args, cancel }) => {
                    const original = args[argIndex];
                    args[argIndex] = async function (...args) {
                        const result = await original.call(this, ...args);
                        Promise.resolve().then(() => {
                            const found = callback();
                            if (found) {
                                if (!options.silent)
                                    Logger.log(`Lazy load in ${method} of ${resolveName(object, method)} found from callback`, { found });
                                resolve(found);
                                cancel();
                            }
                        });
                        return result;
                    };
                }, { silent: true });
            }
        }),
        waitForContextMenu: (callback, options = { silent: false }) => patcher.waitForLazy(Modules.ContextMenuActions, "openContextMenuLazy", 1, callback, options),
        waitForModal: (callback, options = { silent: false }) => patcher.waitForLazy(Modules.ModalActions, "openModalLazy", 0, callback, options)
    };
    return patcher;
};

const createStyles = (id) => {
    return {
        inject(styles) {
            if (typeof styles === "string") {
                BdApi.injectCSS(id, styles);
            }
        },
        clear: () => BdApi.clearCSS(id)
    };
};

const createData = (id) => ({
    load: (key) => BdApi.loadData(id, key) ?? null,
    save: (key, value) => BdApi.saveData(id, key, value),
    delete: (key) => BdApi.deleteData(id, key)
});

class Settings extends Flux.Store {
    constructor(Data, defaults) {
        super(new Flux.Dispatcher(), {
            update: ({ current }) => Data.save("settings", current)
        });
        this.listeners = new Map();
        this.defaults = defaults;
        this.current = { ...defaults, ...Data.load("settings") };
    }
    dispatch() {
        this._dispatcher.dirtyDispatch({ type: "update", current: this.current });
    }
    get() {
        return { ...this.current };
    }
    set(settings) {
        Object.assign(this.current, settings instanceof Function ? settings(this.get()) : settings);
        this.dispatch();
    }
    reset() {
        this.set({ ...this.defaults });
    }
    delete(...keys) {
        for (const key of keys) {
            delete this.current[key];
        }
        this.dispatch();
    }
    connect(component) {
        return Flux.default.connectStores([this], () => ({ ...this.get(), defaults: this.defaults, set: (settings) => this.set(settings) }))(component);
    }
    useCurrent() {
        return Flux.useStateFromStores([this], () => this.get());
    }
    useState() {
        return Flux.useStateFromStores([this], () => [this.get(), (settings) => this.set(settings)]);
    }
    useStateWithDefaults() {
        return Flux.useStateFromStores([this], () => [this.get(), this.defaults, (settings) => this.set(settings)]);
    }
    addListener(listener) {
        const wrapper = ({ current }) => listener(current);
        this.listeners.set(listener, wrapper);
        this._dispatcher.subscribe("update", wrapper);
        return listener;
    }
    removeListener(listener) {
        const wrapper = this.listeners.get(listener);
        if (wrapper) {
            this._dispatcher.unsubscribe("update", wrapper);
            this.listeners.delete(listener);
        }
    }
    removeAllListeners() {
        for (const wrapper of this.listeners.values()) {
            this._dispatcher.unsubscribe("update", wrapper);
        }
        this.listeners.clear();
    }
}
const createSettings = (Data, defaults) => new Settings(Data, defaults);

React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates] = ReactDOM?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.Events ?? [];
const ReactDOMInternals = {
    getInstanceFromNode,
    getNodeFromInstance,
    getFiberCurrentPropsFromNode,
    enqueueStateRestore,
    restoreStateIfNeeded,
    batchedUpdates
};

const confirm = (title, content, options = {}) => BdApi.showConfirmationModal(title, content, options);

const getFiber = (node) => ReactDOMInternals.getInstanceFromNode(node ?? {});
const queryFiber = (fiber, predicate, direction = "up" , depth = 30, current = 0) => {
    if (current > depth) {
        return null;
    }
    if (predicate(fiber)) {
        return fiber;
    }
    if ((direction === "up"  || direction === "both" ) && fiber.return) {
        const result = queryFiber(fiber.return, predicate, "up" , depth, current + 1);
        if (result) {
            return result;
        }
    }
    if ((direction === "down"  || direction === "both" ) && fiber.child) {
        let child = fiber.child;
        while (child) {
            const result = queryFiber(child, predicate, "down" , depth, current + 1);
            if (result) {
                return result;
            }
            child = child.sibling;
        }
    }
    return null;
};
const findOwner = (fiber) => {
    return queryFiber(fiber, (node) => node?.stateNode instanceof React.Component, "up" , 50);
};
const forceFullRerender = (fiber) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        const { stateNode } = owner;
        const original = stateNode.render;
        stateNode.render = function forceRerender() {
            original.call(this);
            stateNode.render = original;
            return null;
        };
        stateNode.forceUpdate(() => stateNode.forceUpdate(() => resolve(true)));
    }
    else {
        resolve(false);
    }
});

const { Flex, Button, Form, margins } = Modules;
const SettingsContainer = ({ name, children, onReset }) => (React.createElement(Form.FormSection, null,
    children,
    React.createElement(Form.FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
    React.createElement(Flex, { justify: Flex.Justify.END },
        React.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                onConfirm: () => onReset()
            }) }, "Reset"))));

const createPlugin = (config, callback) => {
    const { name, version, styles, settings } = config;
    const Logger = createLogger(name, "#3a71c1", version);
    const Patcher = createPatcher(name, Logger);
    const Styles = createStyles(name);
    const Data = createData(name);
    const Settings = createSettings(Data, settings ?? {});
    const plugin = callback({ Logger, Patcher, Styles, Data, Settings, Config: config });
    class Wrapper {
        start() {
            Logger.log("Enabled");
            Styles.inject(styles);
            plugin.start();
        }
        stop() {
            Patcher.unpatchAll();
            Styles.clear();
            plugin.stop();
            Logger.log("Disabled");
        }
    }
    if (plugin.settingsPanel) {
        const ConnectedSettings = Settings.connect(plugin.settingsPanel);
        Wrapper.prototype.getSettingsPanel = () => (React.createElement(SettingsContainer, { name: name, onReset: () => Settings.reset() },
            React.createElement(ConnectedSettings, null)));
    }
    return Wrapper;
};

function forceRerender(selectorOrNode) {
    const element = selectorOrNode instanceof Node ? selectorOrNode : document.querySelector(selectorOrNode.toString());
    if (!element)
        return;
    const fiber = getFiber(element);
    return forceFullRerender(fiber);
}

const name = "DanhoTestZerthox";
const author = "Danho#2105";
const description = "A plugin for testing Danho's code";
const version = "0.0.1";
const config = {
	name: name,
	author: author,
	description: description,
	version: version
};

const styles = ".hello-danho {\n  color: red;\n}";

const guildStyles = byProps("guilds", "base");
const HomeButton = byProps('HomeButton');
const Tooltip = byProps("TooltipContainer");
const Clickable = byName("Clickable");
const index = createPlugin({ ...config, styles }, ({ Data, Logger, Patcher, Settings, Styles, Config }) => {
    const triggerRerender = () => forceRerender(s => s.className(guildStyles.guilds));
    return {
        start() {
            Logger.log('Started plugin');
            Patcher.after(HomeButton, "HomeButton", ({ original: HomeButton, args, result }) => {
                console.log('After HomeButton', { HomeButton, args, result, Tooltip, Clickable });
                return result;
            });
            Patcher.before(Tooltip, "render", ({ args, result }) => {
                console.log('Before Tooltip', { Tooltip, args, result });
                return result;
            });
            triggerRerender();
        },
        stop() {
            Logger.log('Stopped plugin');
            triggerRerender();
        },
    };
});

module.exports = index;

/*@end @*/