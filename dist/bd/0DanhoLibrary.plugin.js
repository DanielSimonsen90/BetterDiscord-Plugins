/**
 * @name DanhoLibrary
 * @description Library for Danho#2105's plugins
 * @author Danho#2105
 * @version 1.0.0
 * @authorLink https://github.com/DanielSimonsen90
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/0DanhoLibrary
 * @updateUrl https://raw.githubusercontent.com/DanielSimonsen90/BetterDiscord-Plugins/master/dist/bd/0DanhoLibrary.plugin.js
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

module.exports = (() => {
    const module = { exports: null };
    try {
'use strict';

const name = "DanhoLibrary";
const description = "Library for Danho#2105's plugins";
const author = "Danho#2105";
const version$1 = "1.0.0";
const config = {
	name: name,
	description: description,
	author: author,
	version: version$1
};

const settings = {};

const createLogger = (name, color, version) => {
    const print = (output, ...data) => output(`%c[${name}] %c${version ? `(v${version})` : ""}`, `color: ${color}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
    return {
        print,
        log: (...data) => print(console.log, ...data),
        warn: (...data) => print(console.warn, ...data),
        error: (...data) => print(console.error, ...data),
        group: (label, collapsed = true) => print(console[(collapsed ? 'groupCollapsed' : 'group')], label),
        groupEnd: () => print(console.groupEnd),
    };
};

const join = (filters) => {
    const apply = filters.filter((filter) => filter instanceof Function);
    return (exports) => apply.every((filter) => filter(exports));
};
const generate = ({ filter, name, props, protos, source }) => [
    ...[filter].flat(),
    typeof name === "string" ? byName$1(name) : null,
    props instanceof Array ? byProps$1(props) : null,
    protos instanceof Array ? byProtos$1(protos) : null,
    source instanceof Array ? bySource$1(source) : null
];
const byExports$1 = (exported) => {
    return (target) => target === exported || (target instanceof Object && Object.values(target).includes(exported));
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
const byProtos$1 = (protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource$1 = (contents) => {
    return (target) => target instanceof Function && contents.every((content) => target.toString().includes(content));
};

const Filters = {
    __proto__: null,
    join: join,
    generate: generate,
    byExports: byExports$1,
    byName: byName$1,
    byOwnName: byOwnName,
    byProps: byProps$1,
    byProtos: byProtos$1,
    bySource: bySource$1
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
const query = (options) => resolveExports(find(...generate(options)), options.export);
const byExports = (exported) => find(byExports$1(exported));
const byName = (name) => resolveExports(find(byName$1(name)), byOwnName(name));
const byProps = (...props) => find(byProps$1(props));
const byProtos = (...protos) => find(byProtos$1(protos));
const bySource = (...contents) => find(bySource$1(contents));
const all = {
    find: (...filters) => raw.all(join(filters)),
    query: (options) => all.find(...generate(options)).map((entry) => resolveExports(entry, options.export)),
    byExports: (exported) => all.find(byExports$1(exported)),
    byName: (name) => all.find(byName$1(name)).map((entry) => resolveExports(entry, byOwnName(name))),
    byProps: (...props) => all.find(byProps$1(props)),
    byProtos: (...protos) => all.find(byProtos$1(protos)),
    bySource: (...contents) => all.find(bySource$1(contents))
};

const index$3 = {
    __proto__: null,
    find: find,
    query: query,
    byExports: byExports,
    byName: byName,
    byProps: byProps,
    byProtos: byProtos,
    bySource: bySource,
    all: all,
    Filters: Filters
};

const EventEmitter = () => byProps("subscribe", "emit");
const React$2 = () => byProps("createElement", "Component", "Fragment");
const ReactDOM$2 = () => byProps("render", "findDOMNode", "createPortal");
const classNames$1 = () => find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const lodash$2 = () => byProps("cloneDeep", "flattenDeep");
const semver$1 = () => byProps("valid", "satifies");
const moment$1 = () => byProps("utc", "months");
const SimpleMarkdown = () => byProps("parseBlock", "parseInline");
const hljs$1 = () => byProps("highlight", "highlightBlock");
const Raven = () => byProps("captureBreadcrumb");
const joi$1 = () => byProps("assert", "validate", "object");

const npm = {
    __proto__: null,
    EventEmitter: EventEmitter,
    React: React$2,
    ReactDOM: ReactDOM$2,
    classNames: classNames$1,
    lodash: lodash$2,
    semver: semver$1,
    moment: moment$1,
    SimpleMarkdown: SimpleMarkdown,
    hljs: hljs$1,
    Raven: Raven,
    joi: joi$1
};

const Flux$1 = () => byProps("Store", "useStateFromStores");
const Dispatcher = () => byProps("dirtyDispatch");

const flux = {
    __proto__: null,
    Flux: Flux$1,
    Dispatcher: Dispatcher
};

const Constants = () => byProps("Permissions", "RelationshipTypes");
const i18n$1 = () => byProps("languages", "getLocale");
const Platforms = () => byProps("getPlatform", "isWindows", "isWeb", "PlatformTypes");
const ClientActions = () => byProps("toggleGuildFolderExpand");
const ChannelStore = () => byProps("getChannel", "hasChannel");
const SelectedChannelStore = () => byProps("getChannelId", "getVoiceChannelId");
const UserStore = () => byProps("getUser", "getCurrentUser");
const GuildMemberStore = () => byProps("getMember", "isMember");
const PresenceStore = () => byProps("getState", "getStatus", "isMobileOnline");
const RelationshipStore = () => byProps("isFriend", "getRelationshipCount");
const MediaEngineStore = () => byProps("getLocalVolume");
const MediaEngineActions = () => byProps("setLocalVolume");
const ContextMenuActions = () => byProps("openContextMenuLazy");
const ModalActions = () => byProps("openModalLazy");
const Flex$1 = () => byName("Flex");
const Button$1 = () => byProps("Link", "Hovers");
const Text = () => byName("Text");
const Links = () => byProps("Link", "NavLink");
const Switch = () => byName("Switch");
const SwitchItem$1 = () => byName("SwitchItem");
const RadioGroup = () => byName("RadioGroup");
const Slider = () => byName("Slider");
const TextInput$1 = () => byName("TextInput");
const Menu = () => byProps("MenuGroup", "MenuItem", "MenuSeparator");
const Form$1 = () => byProps("FormItem", "FormSection", "FormDivider");
const margins$1 = () => byProps("marginLarge");

const DiumModules = {
    __proto__: null,
    Constants: Constants,
    i18n: i18n$1,
    Platforms: Platforms,
    ClientActions: ClientActions,
    ChannelStore: ChannelStore,
    SelectedChannelStore: SelectedChannelStore,
    UserStore: UserStore,
    GuildMemberStore: GuildMemberStore,
    PresenceStore: PresenceStore,
    RelationshipStore: RelationshipStore,
    MediaEngineStore: MediaEngineStore,
    MediaEngineActions: MediaEngineActions,
    ContextMenuActions: ContextMenuActions,
    ModalActions: ModalActions,
    Flex: Flex$1,
    Button: Button$1,
    Text: Text,
    Links: Links,
    Switch: Switch,
    SwitchItem: SwitchItem$1,
    RadioGroup: RadioGroup,
    Slider: Slider,
    TextInput: TextInput$1,
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
    ...DiumModules
});
const Modules$1 = Modules;
const { React: React$1, ReactDOM: ReactDOM$1, classNames, lodash: lodash$1, Flux } = Modules;

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
        waitForContextMenu: (callback, options = { silent: false }) => patcher.waitForLazy(Modules$1.ContextMenuActions, "openContextMenuLazy", 1, callback, options),
        waitForModal: (callback, options = { silent: false }) => patcher.waitForLazy(Modules$1.ModalActions, "openModalLazy", 0, callback, options)
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
    delete: (key) => BdApi.deleteData(id, key),
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

const ReactInternals = React$1?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
const [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates] = ReactDOM$1?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.Events ?? [];
const ReactDOMInternals = {
    getInstanceFromNode,
    getNodeFromInstance,
    getFiberCurrentPropsFromNode,
    enqueueStateRestore,
    restoreStateIfNeeded,
    batchedUpdates
};

const confirm = (title, content, options = {}) => BdApi.showConfirmationModal(title, content, options);
const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
const alert = (title, content) => BdApi.alert(title, content);
const toast = (content, options) => BdApi.showToast(content, options);

const queryTree = (node, predicate) => {
    const worklist = [node];
    while (worklist.length !== 0) {
        const node = worklist.shift();
        if (predicate(node)) {
            return node;
        }
        if (node?.props?.children) {
            worklist.push(...[node.props.children].flat());
        }
    }
    return null;
};
const queryTreeAll = (node, predicate) => {
    const result = [];
    const worklist = [node];
    while (worklist.length !== 0) {
        const node = worklist.shift();
        if (predicate(node)) {
            result.push(node);
        }
        if (node?.props?.children) {
            worklist.push(...[node.props.children].flat());
        }
    }
    return result;
};
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
    return queryFiber(fiber, (node) => node?.stateNode instanceof React$1.Component, "up" , 50);
};
const forceUpdateOwner = (fiber) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        owner.stateNode.forceUpdate(() => resolve(true));
    }
    else {
        resolve(false);
    }
});
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

const index$2 = {
    __proto__: null,
    confirm: confirm,
    sleep: sleep,
    alert: alert,
    toast: toast,
    queryTree: queryTree,
    queryTreeAll: queryTreeAll,
    getFiber: getFiber,
    queryFiber: queryFiber,
    findOwner: findOwner,
    forceUpdateOwner: forceUpdateOwner,
    forceFullRerender: forceFullRerender
};

const { Flex, Button, Form, margins } = Modules$1;
const SettingsContainer = ({ name, children, onReset }) => (React$1.createElement(Form.FormSection, null,
    children,
    React$1.createElement(Form.FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
    React$1.createElement(Flex, { justify: Flex.Justify.END },
        React$1.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                onConfirm: () => onReset()
            }) }, "Reset"))));

const version = "0.2.8";

const createPlugin = (config, callback) => {
    const { name, version, styles, settings } = config;
    const Logger = createLogger(name, "#3a71c1", version);
    const Patcher = createPatcher(name, Logger);
    const Styles = createStyles(name);
    const Data = createData(name);
    const Settings = createSettings(Data, settings ?? {});
    const plugin = callback({ Logger, Patcher, Styles, Data, Settings, Config: config });
    class Wrapper {
        constructor() {
            this.plugin = plugin;
        }
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
    if (plugin.SettingsPanel) {
        Wrapper.prototype.getSettingsPanel = () => (React$1.createElement(SettingsContainer, { name: name, onReset: () => Settings.reset() },
            React$1.createElement(plugin.SettingsPanel, { ...settings })));
    }
    return Wrapper;
};

const Discordium = {
    __proto__: null,
    createPlugin: createPlugin,
    Finder: index$3,
    ReactInternals: ReactInternals,
    ReactDOMInternals: ReactDOMInternals,
    Utils: index$2,
    Modules: Modules$1,
    version: version,
    createStyles: createStyles,
    React: React$1,
    ReactDOM: ReactDOM$1,
    classNames: classNames,
    lodash: lodash$1,
    Flux: Flux
};

const ZLibrary = window.ZLibrary;
const ZLibrary$1 = ZLibrary;

const { BDFDB: BDFDB$1 } = window.BDD?.Libraries ?? window;
var Discord$1;
(function (Discord) {
    Discord.Modules = DiumModules;
    Discord.Margins = query({ props: ["marginLarge"] });
    Discord.ClassModules = Object.assign({}, ZLibrary$1.DiscordClassModules, BDFDB$1.DiscordClassModules);
    Discord.Avatar = query({ props: ['AnimatedAvatar'] });
    Discord.Button = query({ props: ["Link", "Hovers"] });
    Discord.Clickable = query({ name: "Clickable" });
    Discord.DiscordTag = query({ name: "DiscordTag" }).default;
    Discord.Form = query({ props: ["FormItem", "FormSection", "FormDivider"] });
    Discord.Shakeable = query({ name: "Shakeable" }).default;
    Discord.SwitchItem = query({ name: "SwitchItem" }).default;
    Discord.TextInput = query({ name: "TextInput" }).default;
    Discord.Tooltip = query({ props: ['TooltipContainer'] });
    Discord.UserProfileBadgeList = query({ name: "UserProfileBadgeList" });
})(Discord$1 || (Discord$1 = {}));
const Discord$2 = Discord$1;

const { Form: { FormSection }, Margins } = Discord$2;
const Section = ({ title, children, className }) => (React$1.createElement(FormSection, { tag: 'h1', title: title, className: classNames(Margins.marginBottom20, 'settings', className) }, children));

const { Form: { FormItem } } = Discord$2;
const { PopoutRoles } = ZLibrary$1.DiscordClassModules;
const Item = ({ direction, children, className, ...props }) => (React$1.createElement(FormItem, { className: classNames(PopoutRoles.flex, direction, 'center', className), ...props }, children));

const index$1 = {
    __proto__: null,
    Section: Section,
    Item: Item
};

const { SwitchItem, TextInput } = Discord$2;
const { useState: useState$2 } = React$1;
function Setting({ key, value, set, onChange, titles }) {
    const [v, setV] = useState$2(value);
    switch (typeof value) {
        case 'boolean': return React$1.createElement(SwitchItem, { key: key, title: titles[key], value: v, onChange: checked => {
                set({ [key]: checked });
                onChange?.(checked);
                setV(checked);
            } });
        case 'number':
        case 'string': return React$1.createElement(TextInput, { key: key, title: titles[key], value: v, onChange: value => {
                set({ [key]: value });
                onChange?.(value);
                setV(value);
            } });
        default: return (React$1.createElement("div", { className: 'settings-error' },
            React$1.createElement("h1", null, "Unknown value type"),
            React$1.createElement("h3", null,
                "Recieved ",
                typeof value),
            React$1.createElement("h5", null, JSON.stringify(value))));
    }
}

const BDFDB = window.BDFDB.LibraryComponents;

const Components = {
    __proto__: null,
    BDFDB: BDFDB,
    get Discord () { return Discord$1; },
    Form: index$1,
    Setting: Setting
};

const { useMemo: useMemo$1, useEffect, useState: useState$1 } = React$1;
function usePatcher(module, type, patch, callback, config) {
    const { name, version, once } = config;
    const color = config.color ?? "#777";
    const repatchDeps = config.repatchDeps ?? [];
    const patcher = useMemo$1(() => createPatcher(`${name}-settings`, createLogger(`${name}-settings`, color, version)), []);
    const [patched, setPatched] = useState$1(false);
    const [cancel, setCancel] = useState$1(() => () => { });
    useEffect(() => {
        setCancel(patcher[type](module, patch, callback, { once }));
        setPatched(true);
        return cancel;
    }, repatchDeps);
    return [patched, cancel];
}

const { useState, useMemo } = React$1;
function useMemoedState(initialState, factory, dependencies = []) {
    const [state, setState] = useState(initialState);
    const memo = useMemo(() => factory(state), [state, ...dependencies]);
    return [memo, setState, state];
}

const Hooks = {
    __proto__: null,
    usePatcher: usePatcher,
    useMemoedState: useMemoedState
};

const BadReact = {
    __proto__: null,
    'default': React$1
};

const CompiledReact = {
    ...React$1,
    ...ReactDOM$1,
    Components,
    Hooks,
    classNames,
    BadReact
};
const CompiledReact$1 = CompiledReact;

class ElementSelector {
    constructor() {
        this.result = "";
    }
    getElementFromInstance(instance, allowMultiple = false) {
        return getElementFromInstance(instance, allowMultiple);
    }
    id(id, tagName) {
        this.result += `${tagName ?? ''}[id*="${id}"] `;
        return this;
    }
    className(name, tagName) {
        this.result += `${tagName ?? ''}[class*="${name}"] `;
        return this;
    }
    ariaLabel(label, tagName) {
        this.result += `${tagName ?? ''}[aria-label="${label}"] `;
        return this;
    }
    ariaLabelContains(label, tagName) {
        this.result += `${tagName ?? ''}[aria-label*="${label}"] `;
        return this;
    }
    tagName(name) {
        this.result += `${name} `;
        return this;
    }
    get sibling() {
        this.result += `~ `;
        return this;
    }
    directChild(tagName) {
        this.result += `> ${tagName ?? '*'} `;
        return this;
    }
    get and() {
        this.result = this.result.substring(0, this.result.length - 1);
        return this;
    }
    mutationManagerId(id, tagName) {
        this.result += `${tagName ?? ''}[data-mutation-manager-id="${id}"] `;
        return this;
    }
    data(prop, value) {
        this.result += `[data-${prop}"${value ? `="${value}"` : ''}"] `;
        return this;
    }
    role(role, tagName) {
        this.result += `${tagName ?? ''}[role="${role}"] `;
        return this;
    }
    toString() {
        return this.result;
    }
}
const ElementSelector$1 = ElementSelector;
function getElementFromInstance(instance, allowMultiple = false) {
    const selector = new ElementSelector();
    if (instance.type)
        selector.tagName(instance.type.toString()).and;
    if (instance.props) {
        const { props } = instance;
        if (props.id)
            selector.id(props.id).and;
        if (props.className)
            selector.className(props.className).and;
        if (props.ariaLabel)
            selector.ariaLabel(props.ariaLabel).and;
        if (props.role)
            selector.role(props.role).and;
        if (props.dataMutationManagerId)
            selector.mutationManagerId(props.dataMutationManagerId).and;
        if (props.data) {
            for (const prop in props.data) {
                selector.data(prop, props.data[prop]).and;
            }
        }
    }
    return allowMultiple ?
        document.querySelectorAll(selector.toString()) :
        document.querySelector(selector.toString());
}

function $(selector, single = true) {
    if (single)
        return new DQuery(selector);
    let elements = (() => {
        if (typeof selector === 'function') {
            selector = selector(new ElementSelector$1(), $);
        }
        if (selector instanceof ElementSelector$1 || typeof selector === 'string')
            return [...document.querySelectorAll(selector.toString()).values()];
        else if (selector instanceof DQuery) {
            return [selector.element];
        }
        return (Array.isArray(selector) ? selector : [selector]);
    })();
    return elements.map(el => new DQuery(el));
}
class DQuery {
    constructor(selector) {
        this.selector = selector;
        if (selector) {
            const element = (selector instanceof HTMLElement ? selector :
                selector instanceof DQuery ? selector.element :
                    selector instanceof ElementSelector$1 || typeof selector === 'string' ? document.querySelector(selector.toString()) :
                        typeof selector === 'function' ? new DQuery(selector(new ElementSelector$1(), $)).element :
                            selector);
            this.element = element;
        }
    }
    get parent() {
        try {
            return this.element.parentElement ? new DQuery(this.element.parentElement) : undefined;
        }
        catch (err) {
            console.error(err, this.selector);
            return undefined;
        }
    }
    get previousSibling() {
        return new DQuery(this.element.previousElementSibling);
    }
    get nextSibling() {
        return new DQuery(this.element.nextElementSibling);
    }
    get value() {
        if ('value' in this.element)
            return this.element['value'];
        if ('checked' in this.element)
            return this.element['checked'];
        return this.element.textContent;
    }
    get classes() {
        return this.element.classList.value;
    }
    get style() {
        return this.element.style;
    }
    set style(value) {
        for (const key in value) {
            this.element.style[key] = value[key];
        }
    }
    hasDirectChild(selector) {
        if (selector instanceof DQuery)
            selector = selector.element;
        else if (typeof selector === 'string')
            selector = document.querySelector(selector);
        for (const child of this.element.children) {
            if (child == selector)
                return true;
        }
        return false;
    }
    children(selector, single) {
        if (!selector)
            return single ? new DQuery(this.element.children[0]) : [...this.element.children].map(child => new DQuery(child));
        selector = typeof selector === 'function' ? selector(new ElementSelector$1(), $) : selector;
        if (typeof selector === 'string' || selector instanceof ElementSelector$1) {
            const elements = this.element.querySelectorAll(selector.toString());
            return single ? new DQuery(elements[0]) : [...elements.values()].map(child => new DQuery(child));
        }
        const getElement = (element) => {
            const childrenArray = [...element.children];
            if (childrenArray.some(child => child === selector))
                return element;
            for (const child of childrenArray) {
                const result = getElement(child);
                if (result)
                    return result;
            }
            return undefined;
        };
        return getElement(this.element) ? new DQuery(getElement(this.element)) : undefined;
    }
    get firstChild() {
        return this.children()[0];
    }
    get lastChild() {
        const children = this.children();
        return children[children.length - 1];
    }
    get fiber() {
        return this.element['__reactFiber$'];
    }
    get props() {
        return this.fiber.memoizedProps;
    }
    prop(key, ...cycleThrough) {
        const getProp = (obj, path) => {
            if (obj === undefined || obj === null)
                return undefined;
            else if (obj[key])
                return [obj[key], path];
            if (obj.children) {
                if (Array.isArray(obj.children)) {
                    for (let i = 0; i < obj.children.length; i++) {
                        const result = getProp(obj.children[i], [...path, `children`, i.toString()]);
                        if (result)
                            return result;
                    }
                }
                else {
                    const result = getProp(obj.children, [...path, 'children']);
                    if (result)
                        return result;
                }
            }
            if (obj.props) {
                const result = getProp(obj.props, [...path, 'props']);
                if (result)
                    return result;
            }
            if (cycleThrough) {
                for (const prop of cycleThrough) {
                    const result = getProp(obj[prop], [...path, prop]);
                    if (result)
                        return result;
                }
            }
            return undefined;
        };
        return getProp(this.fiber.memoizedProps, []) ?? [undefined, undefined];
    }
    propsWith(key, ...cycleThrough) {
        const [prop, path] = this.prop(key, ...cycleThrough);
        if (prop === undefined)
            return [undefined, undefined];
        const parent = path.reduce((obj, prop) => {
            return obj[prop];
        }, this.fiber.memoizedProps);
        return [parent, path.slice(0, -1)];
    }
    attr(key, value) {
        if (!key)
            return [...this.element.attributes];
        if (value === undefined)
            return this.element.getAttribute(key);
        this.element.setAttribute(key, value);
        return this;
    }
    unmount() {
        this.element.remove();
    }
    appendHtml(html) {
        this.element.appendChild(createElement(html));
        return this;
    }
    appendComponent(component) {
        this.element.appendChild(createElement("<></>"));
        const fragment = this.element.lastChild;
        ReactDOM$1.render(component, fragment, () => this.element.replaceChild(fragment.lastChild, fragment));
        return this;
    }
    replaceComponent(component) {
        this.element.appendChild(createElement("<></>"));
        const fragment = this.element.lastChild;
        ReactDOM$1.render(component, fragment, () => {
            const children = [...this.element.children];
            if (!children.includes(fragment) || !fragment.firstChild)
                return;
            this.parent.element.replaceChild(fragment.firstChild, this.element);
        });
        return this;
    }
    prependHtml(html) {
        this.element.insertAdjacentHTML('afterbegin', html);
        return this;
    }
    prependComponent(component) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="fragment"></div>`);
        const fragment = this.element.firstChild;
        ReactDOM$1.render(component, fragment, () => this.element.replaceChild(fragment.firstChild, fragment));
        return this;
    }
    on(event, listener) {
        this.element.addEventListener(event, listener.bind(this));
        return this;
    }
    off(event, listener) {
        this.element.removeEventListener(event, listener);
        return this;
    }
    async forceUpdate() {
        return forceFullRerender(this.fiber);
    }
}
function createElement(html, target) {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        html = `<div class="fragment"></div>`;
    }
    const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
    if (!target)
        return element;
    if (target instanceof Node)
        return target.appendChild(element);
    else if (target instanceof DQuery)
        return target.element.appendChild(element);
    else if (typeof target === "string" || target instanceof ElementSelector$1 || typeof target === 'function')
        return document.querySelector(typeof target === 'function' ? target(new ElementSelector$1(), $).toString() : target.toString()).appendChild(element);
}

const DanhoModules = {
    CompiledReact: CompiledReact$1,
    $,
    DQuery,
    ElementSelector: ElementSelector$1
};
const DanhoModules$1 = DanhoModules;

const DiscordPermissionStrings = {
    ADD_REACTIONS: "Reactions",
    ADMINISTRATOR: "Admin",
    ATTACH_FILES: "Files",
    BAN_MEMBERS: "Ban",
    CHANGE_NICKNAME: "Nickname",
    CONNECT: "Connect",
    CREATE_INSTANT_INVITE: "Invite",
    DEAFEN_MEMBERS: "Deafen",
    EMBED_LINKS: "Embeds",
    KICK_MEMBERS: "Kick",
    MANAGE_CHANNELS: "Channels",
    MANAGE_GUILD_EXPRESSIONS: "Emojis/Stickers",
    MANAGE_GUILD: "Server",
    MANAGE_MESSAGES: "Messages",
    MANAGE_NICKNAMES: "Nicknames",
    MANAGE_ROLES: "Roles",
    MANAGE_WEBHOOKS: "Webhooks",
    MENTION_EVERYONE: "Mention",
    MOVE_MEMBERS: "Move",
    MUTE_MEMBERS: "Mute",
    PRIORITY_SPEAKER: "Priority",
    READ_MESSAGE_HISTORY: "History",
    SEND_MESSAGES: "Send",
    SEND_TTS_MESSAGES: "TTS",
    STREAM: "Stream/Video",
    SPEAK: "Speak",
    USE_EXTERNAL_EMOJIS: "External",
    USE_VAD: "VC Activity",
    VIEW_AUDIT_LOG: "Audit Log",
    VIEW_CHANNEL: "View",
    VIEW_GUILD_ANALYTICS: "Insights",
};
var ActivityIndexes;
(function (ActivityIndexes) {
    ActivityIndexes[ActivityIndexes["PLAYING"] = 0] = "PLAYING";
    ActivityIndexes[ActivityIndexes["STREAMING"] = 1] = "STREAMING";
    ActivityIndexes[ActivityIndexes["LISTENING"] = 2] = "LISTENING";
    ActivityIndexes[ActivityIndexes["WATCHING"] = 3] = "WATCHING";
    ActivityIndexes[ActivityIndexes["CUSTOM"] = 4] = "CUSTOM";
    ActivityIndexes[ActivityIndexes["COMPETING"] = 5] = "COMPETING";
})(ActivityIndexes || (ActivityIndexes = {}));
var ButtonStyles;
(function (ButtonStyles) {
    ButtonStyles[ButtonStyles["Primary"] = 1] = "Primary";
    ButtonStyles[ButtonStyles["Secondary"] = 2] = "Secondary";
    ButtonStyles[ButtonStyles["Success"] = 3] = "Success";
    ButtonStyles[ButtonStyles["Danger"] = 4] = "Danger";
    ButtonStyles[ButtonStyles["Link"] = 5] = "Link";
})(ButtonStyles || (ButtonStyles = {}));
var TextInputStyles;
(function (TextInputStyles) {
    TextInputStyles[TextInputStyles["Short"] = 1] = "Short";
    TextInputStyles[TextInputStyles["Paragraph"] = 2] = "Paragraph";
})(TextInputStyles || (TextInputStyles = {}));
var PremiumTypes;
(function (PremiumTypes) {
    PremiumTypes[PremiumTypes["User"] = 0] = "User";
    PremiumTypes[PremiumTypes["Classic"] = 1] = "Classic";
    PremiumTypes[PremiumTypes["Nitro"] = 2] = "Nitro";
})(PremiumTypes || (PremiumTypes = {}));

const Discord = {
    __proto__: null,
    DiscordPermissionStrings: DiscordPermissionStrings,
    get ActivityIndexes () { return ActivityIndexes; },
    get PremiumTypes () { return PremiumTypes; }
};

const { hljs, i18n, joi, lodash, moment, semver, React, ReactDOM } = Modules$1;
const DiscordModules = {
    hljs, i18n, joi, lodash, moment, semver,
    Discord,
    React, ReactDOM, DanhoModules: DanhoModules$1
};

const Libraries = {
    ZLibrary: ZLibrary$1,
    BDFDB: window.BDFDB,
    Discordium,
};

const delay = (callback, time) => new Promise((resolve, reject) => {
    try {
        setTimeout(() => resolve(callback()), time);
    }
    catch (err) {
        reject(err);
    }
});

class PluginsCollection extends Array {
    get names() {
        return this.map(plugin => plugin.config.name);
    }
}
const PluginUtils = new class PluginUtils {
    constructor() {
        this._queue = window.BDD_PluginQueue ?? new Array();
        this.plugins = new PluginsCollection();
        this.startPlugins = this.startPlugins.bind(this);
        this.restartPlugins = this.restartPlugins.bind(this);
        this.buildPlugin = this.buildPlugin.bind(this);
        this.stopPlugins = this.stopPlugins.bind(this);
        this.getPlugin = this.getPlugin.bind(this);
    }
    get queue() {
        if (this._queue.includes('DanhoLibrary')) {
            console.warn("[PluginUtils]: DanhoLibrary was found in Plugin queue, which is not intended");
            this._queue.splice(this._queue.indexOf('DanhoLibrary'), 1);
        }
        return this._queue;
    }
    startPlugins() {
        console.log('Starting Danho plugins');
        const { queue } = this;
        while (queue.length > 0) {
            const pluginName = queue.shift();
            try {
                console.log(`[PluginUtils]: Starting plugin ${pluginName}`, BdApi.Plugins.get(pluginName));
                BdApi.Plugins.enable(pluginName);
                const timeout = 100;
                if (!BdApi.Plugins.get(pluginName))
                    setTimeout(() => {
                        const plugin = BdApi.Plugins.get(pluginName);
                        if (!plugin)
                            return console.warn("[PluginUtils]: Plugin not found", pluginName);
                        if (plugin.instance?.__proto__.constructor.name === 'NoPlugin') {
                            console.warn(`[PluginUtils]: Plugin ${pluginName} is not a valid plugin, reloading...`);
                            BdApi.Plugins.reload(pluginName);
                            delay(() => this.plugins.push(BdApi.Plugins.get(pluginName).instance.plugin), timeout);
                        }
                        else
                            this.plugins.push(plugin.instance.plugin);
                    }, timeout);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
        console.log('Started Danho plugins');
    }
    restartPlugins() {
        console.log('Restarting Danho plugins');
        const queue = BdApi.Plugins.getAll()
            .filter(p => p.author === "Danho#2105")
            .map(p => p.name);
        for (const pluginName of queue) {
            try {
                console.log(`[PluginUtils]: Restarting plugin ${pluginName}`);
                BdApi.Plugins.reload(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
    }
    buildPlugin(config, pluginBuilder) {
        const plugin = createPlugin(config, api => new (pluginBuilder(window.BDD))(api));
        window.BDD.PluginUtils.queue.push(config.name);
        window.BDD.PluginUtils.startPlugins();
        return plugin;
    }
    stopPlugins() {
        console.log('Stopping Danho plugins');
        const { queue } = this;
        for (const pluginName of queue) {
            try {
                BdApi.Plugins.disable(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to stop plugin ${pluginName}`, err);
            }
        }
        console.log('Danho plugins stopped');
    }
    getPlugin(...pluginNames) {
        return window.BDD?.Utils.getPlugin(...pluginNames);
    }
};

function findNodeByIncludingClassName(className, node = document.body) {
    return node.querySelector(`[class*="${className}"]`);
}
function findModuleByIncludes(displayName, returnDisplayNamesOnly = false) {
    const modules = window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
    if (!returnDisplayNamesOnly)
        return modules;
    return modules.map(module => module.default.displayName).sort();
}
function findClassModuleContainingClass(className) {
    const DiscordClassModules = ["ZLibrary", "BDFDB"].map(name => [name, window[name].DiscordClassModules]);
    const findModule = (key, lib) => {
        const module = lib[key];
        if (!module)
            return null;
        const filtered = Object.entries(module).map(([moduleKey, value]) => {
            return value.toLowerCase().includes(className.toLowerCase()) && [moduleKey, value];
        }).filter(v => v);
        if (!filtered.length)
            return null;
        return [key, filtered.reduce((result, [item, value]) => {
                result[item] = value;
                return result;
            }, {})];
    };
    return DiscordClassModules.map(([name, lib]) => [name, Object
            .keys(lib)
            .map(k => findModule(k, lib))
            .filter(v => v)
            .reduce((result, [moduleTitle, module]) => {
            result[moduleTitle] = module;
            return result;
        }, {})]).reduce((result, [name, modules]) => {
        result[name] = modules;
        return result;
    }, {});
}
function findModule(args, returnDisplayNamesOnly = false) {
    const module = typeof args === 'string' ? query({ name: args }) : query({ props: args });
    if (!module)
        return module;
    return returnDisplayNamesOnly ?
        Array.isArray(module) ?
            module.map(m => m.default?.displayName || m.displayName) :
            module.default?.displayName || module.displayName
        : module;
}
async function findUserByTag(tag, BDFDB) {
    return new Promise((resolve, reject) => {
        console.time(`Looking for ${tag}`);
        for (let i = 0; i < 9999; i++) {
            const discriminator = i < 9 ? `000${i}` : i < 99 ? `00${i}` : i < 999 ? `0${i}` : i.toString();
            const user = BDFDB.LibraryModules.UserStore.findByTag(tag, discriminator);
            if (user) {
                console.timeEnd(`Looking for ${tag}`);
                return resolve(user);
            }
        }
        console.timeEnd(`Looking for ${tag}`);
        reject(`Could not find user with tag ${tag}`);
    });
}
function getPlugin(...pluginNames) {
    return pluginNames.length === 1 ?
        BdApi.Plugins.get(pluginNames[0]).instance.plugin :
        BdApi.Plugins.getAll().filter(plugin => pluginNames.includes((plugin['name'] || plugin['getName']?.()))).map(plugin => plugin.instance.plugin);
}
const Utils = {
    findNodeByIncludingClassName,
    findModuleByIncludes,
    findClassModuleContainingClass,
    findModule,
    findUserByTag,
    getPlugin
};

const defaultOption = {
    isContextMenu: false,
    isModal: false,
    once: false,
    override: false,
    silent: false
};
function initializePatches(plugin, config = {}) {
    return configurePatches(plugin, config, async ({ patchType, method, option }) => {
        const patch = (module) => commitPatch(plugin, module, { patchType, method, option });
        return optionIsArrayable(option) ?
            patch(getModule(option)) :
            waitForModule(plugin.patcher, option).then(patch);
    });
}
async function configurePatches(plugin, config, callback) {
    const patches = plugin.patches ?? (plugin.patches = new Array());
    const commitPatch = async ({ patchType, method, option }) => {
        const patch = await callback({ patchType, method, option });
        if (!patch)
            return;
        const previouslyPatched = patches.find(p => p.module === patch.module && p.method === patch.method && p.patchType === patch.patchType);
        if (previouslyPatched) {
            if (optionIsArrayable(option) || !option.override)
                return;
            patches.splice(patches.indexOf(previouslyPatched), 1);
            return;
        }
        patches.push(patch);
    };
    for (const pt in config) {
        const patchType = pt;
        const methods = config[patchType];
        for (const m in methods) {
            const method = m;
            const options = config[patchType][method];
            if (typeof options[0] === 'string') {
                const option = Object.assign({}, defaultOption, { selector: options });
                await commitPatch({ patchType, method, option });
                continue;
            }
            for (const o of options) {
                const option = Object.assign({}, defaultOption, o);
                await commitPatch({ patchType, method, option });
            }
        }
    }
    return patches;
}
function optionIsArrayable(option) {
    return Array.isArray(option) || typeof option === 'string';
}
function getModule(selector) {
    return (
    Array.isArray(selector) ? query({ props: selector }) :
        typeof selector === 'string' ? query({ name: selector }) :
            undefined);
}
function commitPatch(plugin, module, { patchType, method, option }) {
    const selector = optionIsArrayable(option) ? option : option.selector;
    const callbackName = (() => {
        const moduleName = module.default?.displayName ? `patch${module.default.displayName}` : selector.toString();
        const callbackPathName = (name) => typeof name === 'string' ? `patch${name}` : moduleName;
        const callbackExists = (callback) => typeof callback === 'function' ? callback.name : callback;
        return !optionIsArrayable(option) && option.callback ?
            callbackExists(option.callback) :
            callbackPathName(optionIsArrayable(option) ? selector : option.selector);
    })();
    const resolvedCallback = plugin[callbackName].bind(plugin);
    [
        [module === undefined, `Could not find module $${typeof selector === 'string' ? `with name "${selector}"` : `with props [${selector.join(', ')}]`}`],
        [resolvedCallback === undefined, `Could not find ${optionIsArrayable(option) ? `"patch${selector}"` :
                typeof option.callback === 'function' ? `callback for "${selector}"` :
                    typeof option.callback === 'string' ? `"${option.callback}"` : 'callback'}`],
    ].forEach(([condition, message]) => {
        if (condition)
            plugin.logger.error(message, option);
    });
    const previouslyPatched = plugin.patches.find(p => p.module === module && p.method === method && p.patchType === patchType);
    if (previouslyPatched && (optionIsArrayable(option) || !option.override)) {
        return previouslyPatched;
    }
    const callback = (data) => {
        try {
            resolvedCallback(data);
        }
        catch (err) {
            plugin.logger.error(`Error in patched method for ${module.default?.displayName || module.displayName || 'module'}`, err, patched);
        }
    };
    const cancel = plugin.patcher[patchType](module, method, callback, option);
    const patched = { module, callback, method, patchType, option, cancel };
    if (!optionIsArrayable(option) && !option.silent)
        plugin.logger.log(`Patched ${patchType} ${method} on ${module.displayName
            || module.default?.displayName
            || (optionIsArrayable(option) ? typeof option === 'string' ? option : `[${option.join(', ')}]` :
                optionIsArrayable(option.selector) ? typeof option.selector === 'string' ? option.selector : `[${option.selector.join(', ')}]` :
                    callbackName)} and bound to ${callbackName}`, patched);
    return patched;
}
function waitForModule(patcher, option) {
    const { selector, isContextMenu, isModal } = option;
    return (isContextMenu ? patcher.waitForContextMenu(() => getModule(selector), { silent: option.silent }) :
        isModal ? patcher.waitForModal(() => getModule(selector), { silent: option.silent }) :
            new Promise(resolve => resolve(getModule(selector))));
}

class ContextMenuProvider {
    constructor(plugin) {
        this.plugin = plugin;
        this.events = {};
        initializePatches(this, {
            after: {
                default: [
                    { selector: 'MessageContextMenu', isContextMenu: true, override: true, callback: this.onMessageContextMenu, silent: true },
                ]
            }
        });
    }
    static getInstance(plugin) {
        if (!ContextMenuProvider.instance) {
            ContextMenuProvider.instance = new ContextMenuProvider(plugin);
        }
        return ContextMenuProvider.instance;
    }
    get logger() {
        return this.plugin.logger;
    }
    get patcher() {
        return this.plugin.patcher;
    }
    on(event, callback) {
        this.events[event] = callback;
    }
    off(event) {
        this.events[event] = null;
    }
    onMessageContextMenu(thisObject, props, ret) {
        this.events['message']?.(props, ret);
    }
}

class DanhoPlugin {
    constructor({ Config, Data, Logger, Patcher, Settings, Styles }) {
        this.events = new Map();
        this.config = Config;
        this.data = Data;
        this.logger = Logger;
        this.patcher = Patcher;
        this.settings = Settings;
        this.styles = Styles;
    }
    async start(config) {
        this.logger.group("Patches");
        this.patches = await initializePatches(this, config);
        this.contextMenus = ContextMenuProvider.getInstance(this);
        this.logger.groupEnd();
        this.logger.groupEnd();
    }
    stop() {
    }
    get BDFDB() {
        return window.BDFDB;
    }
    get ZLibrary() {
        return window.ZLibrary;
    }
    get BDD() {
        return window.BDD;
    }
    on(event, callback) {
        this.events.set(event, [...this.events.get(event) || [], callback]);
    }
    off(event, callback) {
        this.events.set(event, this.events.get(event)?.filter(e => e !== callback));
    }
    emit(event, ...args) {
        this.events.get(event)?.forEach(e => e(...args));
    }
}

class DanhoLibrary extends DanhoPlugin {
    constructor() {
        super(...arguments);
        this.Modules = DiscordModules;
        this.Libraries = Libraries;
        this.PluginUtils = PluginUtils;
        this.Utils = Utils;
    }
    GetPlugin() {
        return DanhoPlugin;
    }
}

class DanhoLibraryGlobal extends DanhoLibrary {
    async start() {
        this.on('plugin-start', this.PluginUtils.startPlugins);
        this.on('plugin-restart', this.PluginUtils.restartPlugins);
        this.on('plugin-stop', this.PluginUtils.stopPlugins);
        if (!window.BDFDB || !window.BDFDB_Global.loaded) {
            this.logger.log('Waiting for BDFDB to load...');
            const waitForBDFDB = async () => {
                if (!window.BDFDB || !window.BDFDB_Global.loaded) {
                    return delay(waitForBDFDB, 1000);
                }
                this.logger.log('BDFDB loaded.');
                if (window.BDD)
                    this.emit('plugin-restart');
            };
            waitForBDFDB();
        }
    }
    stop() {
        this.emit('plugin-stop');
    }
}
const index = createPlugin({ ...config, settings }, api => {
    const plugin = new DanhoLibraryGlobal(api);
    window.BDD ?? (window.BDD = plugin);
    window.BDD.PluginUtils?.restartPlugins();
    return plugin;
});

module.exports = index;

    } catch (err) {
        if ('DanhoLibrary' === 'DanhoLibrary') console.error(err);
        
        if (window.BDD) console.error(err);
        else module.exports = class NoPlugin {
            //start() { BdApi.Alert("this.name could not be loaded!") }
            start() {
                window.BDD_PluginQueue ??= [];

                if (!this.isLib) {
                    if (window.BDD_PluginQueue.includes(this.name)) return console.log(`${this.name} is already in plugin queue`, err);
                    window.BDD_PluginQueue.push(this.name); 
                } else {
                    setTimeout(() => {
                        BdApi.Plugins.reload(this.name);

                        setTimeout(() => window.BDD?.PluginUtils.restartPlugins(), 500);
                    }, 1000);
                }
            }
            stop() {}

            name = 'DanhoLibrary';
            isLib = 'DanhoLibrary' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
