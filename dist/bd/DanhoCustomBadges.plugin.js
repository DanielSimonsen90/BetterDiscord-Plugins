/**
 * @name DanhoCustomBadges
 * @description Add custom badges >:)
 * @author Danho#2105
 * @version 0.0.2
 * @authorLink https://github.com/Danho#2105
 * @website https://github.com/Zerthox/BetterDiscord-Plugins
 * @source https://github.com/Zerthox/BetterDiscord-Plugins/tree/master/src/DanhoCustomBadges
 * @updateUrl https://raw.githubusercontent.com/Zerthox/BetterDiscord-Plugins/master/dist/bd/DanhoCustomBadges.plugin.js
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
    protos instanceof Array ? byProtos(protos) : null,
    source instanceof Array ? bySource(source) : null
];
const byName$1 = (name) => {
    return (target) => target instanceof Object && target !== window && Object.values(target).some(byOwnName(name));
};
const byOwnName = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byProps$1 = (props) => {
    return (target) => target instanceof Object && props.every((prop) => prop in target);
};
const byProtos = (protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource = (contents) => {
    return (target) => target instanceof Function && contents.every((content) => target.toString().includes(content));
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
const Button$3 = () => byProps("Link", "Hovers");
const Text = () => byName("Text");
const Links = () => byProps("Link", "NavLink");
const Switch = () => byName("Switch");
const SwitchItem$1 = () => byName("SwitchItem");
const RadioGroup = () => byName("RadioGroup");
const Slider = () => byName("Slider");
const TextInput$3 = () => byName("TextInput");
const Menu = () => byProps("MenuGroup", "MenuItem", "MenuSeparator");
const Form$2 = () => byProps("FormItem", "FormSection", "FormDivider");
const margins$1 = () => byProps("marginLarge");

const DiumModules = {
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
    Button: Button$3,
    Text: Text,
    Links: Links,
    Switch: Switch,
    SwitchItem: SwitchItem$1,
    RadioGroup: RadioGroup,
    Slider: Slider,
    TextInput: TextInput$3,
    Menu: Menu,
    Form: Form$2,
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

const confirm = (title, content, options = {}) => BdApi.showConfirmationModal(title, content, options);

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

const { Flex, Button: Button$2, Form: Form$1, margins } = Modules;
const SettingsContainer = ({ name, children, onReset }) => (React.createElement(Form$1.FormSection, null,
    children,
    React.createElement(Form$1.FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
    React.createElement(Flex, { justify: Flex.Justify.END },
        React.createElement(Button$2, { size: Button$2.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
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
            if (!element
                && selector
                && !(typeof selector === 'function')
            )
                console.trace(`%cCould not find element with selector: ${selector}`, "color: lightred; background-color: darkred;");
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
        ReactDOM.render(component, fragment, () => this.element.replaceChild(fragment.lastChild, fragment));
        return this;
    }
    replaceComponent(component) {
        this.element.appendChild(createElement("<></>"));
        const fragment = this.element.lastChild;
        ReactDOM.render(component, fragment, () => {
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
        ReactDOM.render(component, fragment, () => this.element.replaceChild(fragment.firstChild, fragment));
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

const ZLibrary = window.ZLibrary;
const ZLibrary$1 = ZLibrary;

let BDFDB = window.BDFDB;
const _BDFDB = BDFDB;

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

class MessageDOMArray extends Array {
    constructor(source) {
        super(...$(source.rootNode).children('ol', true).children('li').map(d => d.element));
        this.source = source;
    }
    get last() {
        return this[this.length - 1];
    }
    lastSentFrom(userId) {
        return this.reverse().find(message => message.dataset.authorId === userId ?? document.body.dataset.currentUserId);
    }
}
const MessageDOMArray$1 = MessageDOMArray;

class ButtonDOMMap extends Map {
    constructor(dom) {
        super();
        this.dom = dom;
        const childFrom = (element, selector) => element.children(selector, true);
        const expression = (label) => childFrom(this.buttonsRight, s => s.className("expression-picker-chat-input-button", 'div').ariaLabelContains(label, 'button'));
        const buttons = new Map([
            ['attach', childFrom(this.buttonsLeft, s => s.className("attachButton", 'button'))],
            ['timestamp', childFrom(this.buttonsRight, s => s.className("timestamp-button", 'button'))],
            ['gift', childFrom(this.buttonsRight, s => s.ariaLabelContains("gift", 'button'))],
            ['gif', expression("GIF picker")],
            ['sticker', expression("sticker picker")],
            ['emoji', expression("Select emoji")],
            ['send', childFrom(this.buttonsRight, s => s.ariaLabel("Send Message", 'button'))],
            ['thread', childFrom(this.buttonsToolbar, s => s.ariaLabel("Threads", 'div'))],
            ['mute', childFrom(this.buttonsToolbar, s => s.ariaLabel("Notification Settings", 'div'))],
            ['pin', childFrom(this.buttonsToolbar, s => s.ariaLabel("Pinned Messages", 'div'))],
            ['member-list', childFrom(this.buttonsToolbar, s => s.ariaLabelContains("Member List", 'div'))],
            ['search', childFrom(this.buttonsToolbar, s => s.className('searchBar', 'div').role("button"))],
            ['inbox', childFrom(this.buttonsToolbar, s => s.ariaLabel("Inbox", 'div'))],
        ]);
        for (const [key, value] of buttons) {
            this.set(key, value);
        }
    }
    get buttonsLeft() {
        return this.dom.textArea.children(s => s.className("attachWrapper"), true);
    }
    get buttonsRight() {
        return this.dom.textArea.children(s => s.className("buttons"), true);
    }
    get buttonsToolbar() {
        return this.dom.content.previousSibling.children(s => s.className("toolbar"), true);
    }
}
const ButtonDOMMap$1 = ButtonDOMMap;

class DOM {
    constructor(source) {
        this.source = source;
        this.messages = new MessageDOMArray$1(this.source);
        this.buttons = new ButtonDOMMap$1(this);
    }
    get content() {
        return this.source.rootNode;
    }
    get channelList() {
        return $(s => s.ariaLabel("Channels", 'ul'));
    }
    get channelListItem() {
        return this.channelList.children(s => s
            .className("containerDefault", 'li')
            .and
            .data("dnd-name", this.source.props.channel.name));
    }
    get textArea() {
        return this.content.children(s => s.tagName("form").className("channelTextArea", 'div'), true);
    }
    get search() {
        return this.content.previousSibling.children(s => s.className("DraftEditor-editorContainer", 'div'), true);
    }
}
const DOM$1 = DOM;

class ChannelManipulator {
    constructor(record, props) {
        this.props = props;
        this.rootNode = $(record.target);
        this.dom = new DOM$1(this);
    }
    writeText(text) {
        const chatInput = $(s => s.tagName('main').tagName("form").className("channelTextArea").className("textArea").role("textbox", 'div'), true);
        const [insertText] = chatInput.prop("insertText", "node");
        insertText(text);
    }
    triggerButton(type) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.dom.buttons.get(type).element.click());
            }, 100);
        });
    }
    addButton(panel, side, button) {
        const buttonContainer = (() => {
            switch (panel) {
                case 'left': return this.dom.buttons.buttonsLeft;
                case 'right': return this.dom.buttons.buttonsRight;
                case 'toolbar': return this.dom.buttons.buttonsToolbar;
                default: {
                    console.error(`Unknown panel ${panel}`);
                    return this.dom.buttons.buttonsRight;
                }
            }
        })();
        return buttonContainer[`${side === 'left' ? 'prepend' : 'append'}Component`](button);
    }
    pin(message) {
        this.togglePin(message, true);
    }
    unpin(message) {
        this.togglePin(message, false);
    }
    togglePin(message, force) {
        const [props] = $(message).prop("message");
        if ((props.pinned && force) || (!props.pinned && !force))
            return;
        console.error(`Toggle pin is not implemented yet`);
    }
    delete(message) {
        console.error(`Delete message is not implemented yet`);
    }
    react(reaction, message) {
        console.error(`React message is not implemented yet`);
    }
}

class UserPopoutManipulator {
    constructor(record, props) {
        this.rootNode = $(record.target);
        this.props = {
            ...props,
            get user() {
                return ZLibrary$1.DiscordModules.UserStore.getUser(props.userId);
            },
            get member() {
                return ZLibrary$1.DiscordModules.GuildMemberStore.getMember(props.guildId, props.userId);
            },
            get channel() {
                return ZLibrary$1.DiscordModules.ChannelStore.getChannel(props.channelId);
            },
            get guild() {
                return ZLibrary$1.DiscordModules.GuildStore.getGuild(props.guildId);
            }
        };
    }
    get userProfile() {
        return { ...this.props.user,
            badges: this.rootNode.children(s => s.className("profileBadges").className("clickable")).map((ref, index) => ({
                ref, index,
                clickable: { ...ref.props, ariaLabel: ref.props['aria-label'] },
                img: { ...ref.children(null, true).props, ariaHidden: ref.props['aria-hidden'] }
            })),
            note: this.rootNode.children(s => s.className("note").tagName("textarea"), true).value,
            status: _BDFDB.UserUtils.getStatus(this.props.userId),
            customStatus: _BDFDB.UserUtils.getCustomStatus(this.props.userId),
            activity: _BDFDB.UserUtils.getActivity(this.props.userId), };
    }
    get guildProfile() {
        return { ...this.props.member,
            roles: this.props.member.roles.map(id => this.props.guild.roles[id]).sort((a, b) => b.position - a.position),
            permissions: Object.keys(DiscordPermissionStrings)
                .map(perm => _BDFDB.UserUtils.can(perm, this.props.userId, this.props.channelId)
                && perm).filter(v => v),
            owner: this.props.guild.ownerId === this.props.userId,
            boostedSince: new Date(this.props.member.premiumSince),
            memberlistIndex: $(s => s
                .className('membersWrap', 'aside')
                .className('content', 'div').and.role("list").and.ariaLabel("Members")
                .role("listitem", 'div'), false)
                .filter(member => member.attr("data-user-id") === this.props.userId)
                .map(member => member.attr("data-list-item-id")
                .split('_')
                .reverse()[0]).map(i => Number(i))[0]
        };
    }
    addBadge(badge, position) {
        const { clickable, img } = badge;
        const badgeList = this.rootNode.children(s => s.className("profileBadges"), true);
        const Clickable = ({ children, ariaLabel, className, ...handlers }) => (React.createElement("div", { className: classNames(badgeList.children(null, true).classes, className), "aria-label": ariaLabel, role: "button", tabIndex: 0, ...handlers }, children));
        const Img = ({ src, className, ...handlers }) => (React.createElement("img", { alt: ' ', "aria-hidden": true, src: src, className: classNames(badgeList.children("img", true).classes, className), ...handlers }));
        const component = (React.createElement(Clickable, { ...clickable },
            React.createElement(Img, { ...img })));
        console.log(component);
        return badgeList.appendComponent(component);
    }
}

class ObservationConfig {
    constructor(preferredSelector, discordSelector, setupCallback, dependency) {
        this.preferredSelector = preferredSelector;
        this.setupCallback = setupCallback;
        this.dependency = dependency;
        this.ready = false;
        this.hasRan = false;
        this.discordSelector = Array.isArray(discordSelector) ? discordSelector.join(' ') : discordSelector;
    }
    get element() {
        return $(this.discordSelector);
    }
    toString() {
        return `${this.discordSelector instanceof HTMLElement ? (`<${this.discordSelector.tagName.toLowerCase()} class="${this.discordSelector.classList.value}"${this.discordSelector.ariaLabel ? ` aria-label="${this.discordSelector.ariaLabel}"` : ''}>`) : this.discordSelector.toString()} (data-mutation-manager-id="${this.preferredSelector}")`;
    }
}
const ObservationConfig$1 = ObservationConfig;

function group(label, ...data) {
    console.groupCollapsed(`%c[${new Date().toLocaleTimeString()}] [${label}]%c`, "color: #3E70DD;", "color: #7898DA;", ...data);
}
class MutationManager {
    constructor() {
        this.observers = new Map();
        this.observations = new Map();
        this.observerLocks = new Map();
        this.observationCache = new Map();
        this.observations.set('layer-change', new ObservationConfig$1('layer-change',
        MutationManager.writeSelector.id("app-mount").className("app-", 'div').sibling.className('layerContainer', 'div'), function (record, callback) {
            if (record.type !== 'childList'
                || !record.addedNodes.length
                || !(record.addedNodes[0] instanceof HTMLElement)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0]))
                return;
            const props = $(record.addedNodes[0]).props;
            return callback(record, $(record.addedNodes[0]).fiber, props);
        }));
        this.observations.set('discord-content-change', new ObservationConfig$1('discord-content', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .sibling
            .className('base', 'div')
            .directChild('div').and.className('content'), function (record, callback) {
            if (!MutationManager.isDirectChild(this.element, record.target))
                return;
            return callback(record, $(record.addedNodes[0]).fiber);
        }));
        this.observations.set('guild-change', new ObservationConfig$1('guild-list', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .ariaLabel('Servers', 'div'), function (record, callback) {
            if (!record.target
                || !(record.target instanceof Element)
                || !record.target.classList.contains('bd-selected')
                || !record.target.classList.value.includes("listItem")
                || record.type !== 'attributes'
                || record.attributeName !== 'class')
                return;
            const [guild] = $(record.target).prop("guild");
            return callback(record, $(record.addedNodes[0]).fiber, guild);
        }));
        this.observations.set('channel-change', new ObservationConfig$1('channel-content', () => $('main[class*="chatContent"]').parent, function (record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || record.addedNodes[0].tagName !== 'MAIN')
                return;
            const [props] = $(record.target).propsWith("channel");
            return callback(record, $(record.addedNodes[0]).fiber, props, new ChannelManipulator(record, props));
        }, 'discord-content-change'));
        this.observations.set('user-popout', new ObservationConfig$1('user-popout', MutationManager.writeSelector
            .id("app-mount", 'div')
            .directChild('div').and.className("appDevToolsWrapper")
            .className("layerContainer", 'div')
            .id("popout", 'div'), function (record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !(record.addedNodes[0] instanceof Element)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || !record.addedNodes[0].classList.value.includes('layer')
                || !record.addedNodes[0].id.includes("popout"))
                return;
            console.log('user-popout');
            const [props] = $(record.addedNodes[0]).propsWith("closePopout");
            if (!props)
                return false;
            return callback(record, $(record.addedNodes[0]).fiber, props, new UserPopoutManipulator(record, props));
        }, 'layer-change'));
        window.observations = () => console.log(this.observations);
    }
    static isDirectChild(parent, child) {
        return child && child instanceof HTMLElement && parent.hasDirectChild(child);
    }
    static get writeSelector() {
        return new ElementSelector$1();
    }
    static classIncludes(selector, element = "div") {
        return `${element}[class*="${selector}"]`;
    }
    static includesChain(...selectors) {
        return selectors.map(selector => typeof selector === 'string' ?
            this.classIncludes(selector) :
            this.classIncludes(selector.className, selector.type ?? 'div') + selector.label ? `[aria-label="${selector.label}"]` : '').join(" ");
    }
    on(key, callback) {
        group(`on(${key})`);
        const observation = (typeof key === 'string' ? this.observations.get(key) : key);
        console.log(`Observation found`, observation);
        if (observation.ready)
            return this;
        const that = this;
        function setObservation(element, once = false) {
            const observer = new MutationObserver(records => {
                let observation = that.observations.get(key);
                if (once && observation.hasRan)
                    return observer.disconnect();
                if (!records.length)
                    return;
                group(`on(${key})`);
                for (const record of records) {
                    observation.setupCallback(record, (...args) => {
                        var cached = that.observationCache.get(key);
                        const [_, ...noRecord] = args;
                        console.log(`Observation callback`, noRecord, cached);
                        if (cached && cached[0] == noRecord[0])
                            return false;
                        const successful = callback(...args);
                        console.log({
                            successful,
                            callback,
                            args,
                            key
                        });
                        if (successful)
                            observation.hasRan = true;
                        if (successful && once) {
                            observer.disconnect();
                            that.observations.delete(key);
                            that.observationCache.delete(key);
                        }
                        that.observations.set(key, observation);
                        that.observationCache.set(key, noRecord);
                        return successful;
                    });
                }
                console.groupEnd();
                console.groupEnd();
            });
            if (!element) {
                console.error(`Observation ${key} could not find selector ${observation.preferredSelector}`);
                return that;
            }
            $(element).attr('data-mutation-manager-id', observation.preferredSelector);
            console.log(`Element selected`, element);
            observer.observe(element, {
                attributes: true,
                subtree: true,
                childList: true,
            });
            observation.ready = true;
            that.observers.set(key, observer);
            console.log(`Observer construction complete`, [
                that.observers,
                observer, key, observation, element,
            ]);
            console.groupEnd();
            return that;
        }
        return !observation.dependency ?
            setObservation($(observation.discordSelector).element) :
            this.on(observation.dependency, record => {
                const [addedNode] = record.addedNodes;
                if (!addedNode || !(addedNode instanceof HTMLElement))
                    return false;
                const lookingFor = $(observation.discordSelector.toString()).element;
                if (!lookingFor)
                    return false;
                const found = (addedNode === lookingFor ||
                    addedNode.querySelector(observation.discordSelector.toString().split(' ').reverse().slice(1)[0]) === lookingFor);
                if (found)
                    setObservation(addedNode, observation.dependency === 'once');
                observation.setupCallback(record, callback);
                this.observers.get(observation.dependency).disconnect();
                this.observations.delete(observation.dependency);
                return true;
            });
    }
    off(key) {
        if (!this.observations[key]) {
            console.error(`Observation ${key} does not exist`);
            return this;
        }
        const observation = this.observations[key];
        if (!observation.ready)
            return this;
        const observer = this.observers.get(key);
        if (!observer)
            return this;
        observer.disconnect();
        observation.ready = false;
        this.observers.delete(key);
        return this;
    }
    clear() {
        for (const observer of this.observers.values()) {
            observer.disconnect();
        }
        return this;
    }
    debounce(prop, callback, delay = 100) {
        clearTimeout(this.observerLocks[prop]);
        this.observerLocks[prop] = setTimeout(callback, delay);
    }
}
function initializeMutations(plugin, config) {
    const mutationManager = new MutationManager();
    if (!config.mutations)
        return mutationManager;
    for (const key in config.mutations) {
        const callback = typeof config[key] === 'string' ? plugin[key] : config.mutations[key];
        mutationManager.on(key, callback.bind(plugin));
        console.log(`Observing ${key} bound to ${callback.name}`);
    }
    return mutationManager;
}

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
    for (const pt in config) {
        const patchType = pt;
        const methods = config[patchType];
        for (const m in methods) {
            const method = m;
            const options = config[patchType][method];
            for (const o of options) {
                const option = Object.assign({}, defaultOption, o);
                const patch = await callback({ patchType, method, option });
                if (!patch)
                    continue;
                const previouslyPatched = patches.find(p => p.module === patch.module && p.method === patch.method && p.patchType === patch.patchType);
                if (previouslyPatched) {
                    if (optionIsArrayable(option) || !option.override)
                        continue;
                    patches.splice(patches.indexOf(previouslyPatched), 1);
                    continue;
                }
                patches.push(patch);
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
        const moduleName = module.default?.displayName ? `patch${module.default.displayName}` : undefined;
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
    const callback = ((data) => {
        try {
            resolvedCallback(data);
        }
        catch (err) {
            plugin.logger.error(err, patched);
        }
    }).bind(plugin);
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
        this.config = Config;
        this.data = Data;
        this.logger = Logger;
        this.patcher = Patcher;
        this.settings = Settings;
        this.styles = Styles;
    }
    async start(config) {
        this.logger.group("Patches");
        const { mutations, ...patchConfig } = config;
        this.mutationManager = initializeMutations(this, { mutations });
        this.patches = await initializePatches(this, patchConfig);
        this.contextMenus = ContextMenuProvider.getInstance(this);
        this.logger.groupEnd();
    }
    stop() {
        this.mutationManager.clear();
    }
    get BDFDB() {
        return window.BDFDB;
    }
    on(observation, callback) {
        return this.mutationManager.on(observation, callback);
    }
    off(observation) {
        return this.mutationManager.off(observation);
    }
}

var Discord;
(function (Discord) {
    Discord.Modules = DiumModules;
    Discord.Margins = query({ props: ["marginLarge"] });
    Discord.ClassModules = Object.assign({}, ZLibrary$1.DiscordClassModules, _BDFDB.DiscordClassModules);
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
})(Discord || (Discord = {}));
const Discord$1 = Discord;

const { Form: { FormSection }, Margins: Margins$2 } = Discord$1;
const Section$1 = ({ title, children, className }) => (React.createElement(FormSection, { tag: 'h1', title: title, className: classNames(Margins$2.marginBottom20, 'settings', className) }, children));

const { Form: { FormItem: FormItem$2 } } = Discord$1;
const { PopoutRoles } = ZLibrary$1.DiscordClassModules;
const Item$1 = ({ direction, children, className, ...props }) => (React.createElement(FormItem$2, { className: classNames(PopoutRoles.flex, direction, 'center', className), ...props }, children));

const Form = {
    __proto__: null,
    Section: Section$1,
    Item: Item$1
};

const { SwitchItem, TextInput: TextInput$2 } = Discord$1;
const { useState: useState$5 } = React;
function Setting({ key, value, set, onChange, titles }) {
    const [v, setV] = useState$5(value);
    switch (typeof value) {
        case 'boolean': return React.createElement(SwitchItem, { key: key, title: titles[key], value: v, onChange: checked => {
                set({ [key]: checked });
                onChange?.(checked);
                setV(checked);
            } });
        case 'number':
        case 'string': return React.createElement(TextInput$2, { key: key, title: titles[key], value: v, onChange: value => {
                set({ [key]: value });
                onChange?.(value);
                setV(value);
            } });
        default: return (React.createElement("div", { className: 'settings-error' },
            React.createElement("h1", null, "Unknown value type"),
            React.createElement("h3", null,
                "Recieved ",
                typeof value),
            React.createElement("h5", null, JSON.stringify(value))));
    }
}

function Badge(props) {
    const { TooltipContainer, Clickable } = props.BDFDB.LibraryComponents;
    const { tooltip, clickable, img } = getProps(props);
    const onClickableClick = props.href ? () => window.open(props.href) :
        props.onClick ? props.onClick : undefined;
    const icon = (typeof img.src === 'string' ?
        React.createElement("img", { alt: ' ', "aria-hidden": true, src: img.src, className: img.className }) :
        img.src);
    return (React.createElement(TooltipContainer, { ...tooltip },
        React.createElement(Clickable, { ...clickable, role: "button", tabIndex: 0, onClick: onClickableClick, ...{
                "data-href": props.href,
                "data-id": props.id
            } }, icon)));
}
function getProps(props) {
    const classes = {
        clickable: ZLibrary$1.DiscordClassModules.UserModal.clickable,
        img: ZLibrary$1.DiscordClassModules.UserModal.profileBadge22,
    };
    const tooltip = {
        text: props.tooltipText,
        spacing: props.spacing || 24,
        key: props.tooltipText
    };
    const clickable = {
        className: classNames(classes.clickable, "danho-badge", props.classNameClickable),
        "aria-label": props.tooltipText,
    };
    const img = {
        src: props.src,
        className: classNames(classes.img, props.classNameImg),
    };
    return { tooltip, clickable, img };
}

const titles = {
    allowVerified: 'Allow custom Verified badge',
    allowVerifiedInvite: 'When clicking on a Verified badge, open the invite link to the server',
    allowPartneredInvite: 'When clicking on a Partnered badge, open the invite link to the server',
    users: 'Custom badges'
};

const name = "DanhoCustomBadges";
const description = "Add custom badges >:)";
const author = "Danho#2105";
const version = "0.0.2";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

function DefaultIcon() {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "71", height: "55", viewBox: "0 0 71 55", fill: "none" },
        React.createElement("link", { type: "text/css", rel: "stylesheet", id: "dark-mode-custom-link" }),
        React.createElement("link", { type: "text/css", rel: "stylesheet", id: "dark-mode-general-link" }),
        React.createElement("style", { lang: "en", type: "text/css", id: "dark-mode-custom-style" }),
        React.createElement("style", { lang: "en", type: "text/css", id: "dark-mode-native-style" }),
        React.createElement("g", { "clip-path": "url(#clip0)" },
            React.createElement("path", { xmlns: "http://www.w3.org/2000/svg", d: "M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z", fill: "var(--brand-experiment, hsl(235, calc(var(--saturation-factor, 1) * 85.6%), 64.7%))" })),
        React.createElement("defs", null,
            React.createElement("clipPath", { id: "clip0" },
                React.createElement("rect", { width: "71", height: "55", fill: "white" })))));
}

const { Button: Button$1, TextInput: TextInput$1, Form: { FormItem: FormItem$1 }, Margins: Margins$1 } = Discord;
const { useState: useState$4, useMemo: useMemo$2, useCallback: useCallback$2 } = React;
function SettingsBadge({ badge, user, onUpdate, onDelete }) {
    const [tooltip, setTooltip] = useState$4(badge.tooltip);
    const [src, setSrc] = useState$4(badge.src);
    const [href, setHref] = useState$4(badge.href);
    const [index, setIndex] = useState$4(badge.index.toString() ?? "0");
    const update = useMemo$2(() => ({ ...badge, tooltip, index: parseInt(index), src, href }), [tooltip, index, src, href]);
    const move = useCallback$2((offset) => {
        let newIndex = parseInt(index) + offset;
        if (newIndex < 0)
            newIndex = 0;
        onUpdate({ ...update, index: newIndex });
    }, [index, length, onUpdate, update]);
    const onTextChange = useCallback$2((value) => {
        if (!value)
            return setIndex("");
        let timeout;
        setIndex(value);
        clearTimeout(timeout);
        timeout = setTimeout(() => onUpdate({ ...update, index: parseInt(value) }), 500);
    }, [index]);
    return (React.createElement("div", { className: "settings-badge" },
        React.createElement("div", { className: "badge-form" },
            React.createElement(FormItem$1, null,
                React.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: 'https://media.discordapp.net/attachments/{channelId}/{messageId}}/unknown.png', value: src, onChange: setSrc }),
                React.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: `${user.username}'s new badge`, value: tooltip, onChange: setTooltip }),
                React.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: 'https://google.com', value: href, onChange: setHref }))),
        React.createElement("div", { className: "button-container" },
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => onUpdate(update), color: Button$1.Colors.GREEN }, "Update badge"),
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: onDelete, color: Button$1.Colors.RED }, "Delete"),
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => move(-1), color: Button$1.Colors.BRAND_NEW }, "\u25C0"),
            React.createElement(TextInput$1, { className: 'text-input-container', placeholder: 'Index', value: index.toString(), onChange: onTextChange }),
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => move(1), color: Button$1.Colors.BRAND_NEW }, "\u25B6"))));
}

function PlusIcon({ onClick }) {
    const { profileBadge22 } = ZLibrary$1.DiscordClassModules.UserModal;
    return (React.createElement("div", { className: "add-badge", onClick: onClick },
        React.createElement("svg", { className: profileBadge22, xmlns: "http://www.w3.org/2000/svg", version: "1.1", id: "Capa_1", x: "0px", y: "0px", viewBox: "0 0 490.2 490.2", style: {
                fill: 'var(--text-muted)'
            } },
            React.createElement("g", null,
                React.createElement("g", null,
                    React.createElement("path", { d: "M418.5,418.5c95.6-95.6,95.6-251.2,0-346.8s-251.2-95.6-346.8,0s-95.6,251.2,0,346.8S322.9,514.1,418.5,418.5z M89,89    c86.1-86.1,226.1-86.1,312.2,0s86.1,226.1,0,312.2s-226.1,86.1-312.2,0S3,175.1,89,89z" }),
                    React.createElement("path", { d: "M245.1,336.9c3.4,0,6.4-1.4,8.7-3.6c2.2-2.2,3.6-5.3,3.6-8.7v-67.3h67.3c3.4,0,6.4-1.4,8.7-3.6c2.2-2.2,3.6-5.3,3.6-8.7    c0-6.8-5.5-12.3-12.2-12.2h-67.3v-67.3c0-6.8-5.5-12.3-12.2-12.2c-6.8,0-12.3,5.5-12.2,12.2v67.3h-67.3c-6.8,0-12.3,5.5-12.2,12.2    c0,6.8,5.5,12.3,12.2,12.2h67.3v67.3C232.8,331.4,238.3,336.9,245.1,336.9z" }))))));
}

const { UserProfileBadgeList, ClassModules: ClassModules$1 } = Discord$1;
const { default: BadgeList } = UserProfileBadgeList;
const { useEffect: useEffect$2, createRef: createRef$1 } = React;
function SettingsBadgeList({ user, BDFDB, data: { premiumSince, boosterSince, badges }, onBadgeClick, onAddBadgeClick }) {
    const containerRef = createRef$1();
    useEffect$2(() => {
        if (!containerRef.current)
            return;
        const children = $(containerRef.current).firstChild.children().map(badge => ({
            tooltipText: badge.element.ariaLabel,
            src: badge.firstChild.attr('src'),
            href: badge.firstChild.attr("data-href"),
            id: badge.attr("data-id"),
            isDanhoBadge: badge.classes.includes("danho-badge"),
        })).map(({ isDanhoBadge, ...data }, index) => (React.createElement(Badge, { key: index, BDFDB: BDFDB, ...data, classNameClickable: isDanhoBadge && "custom", onClick: () => isDanhoBadge && onBadgeClick(badges.find(b => b.id === data.id)) })));
        ReactDOM.render((React.createElement(React.Fragment, null,
            children,
            React.createElement(PlusIcon, { onClick: onAddBadgeClick }))), containerRef.current.lastElementChild);
    }, [badges, onBadgeClick, BDFDB]);
    return (React.createElement("div", { className: "settings-badge-list-container", ref: containerRef },
        React.createElement(BadgeList, { user: user, className: 'hidden', premiumSince: premiumSince ? new Date(premiumSince) : null, premiumGuildSince: boosterSince ? new Date(boosterSince) : null }),
        React.createElement("div", { "data-user-id": user.id, className: classNames("settings-badge-list", BDFDB.DiscordClassModules.UserBadges.container, BDFDB.DiscordClassModules.UserProfileHeader.badgeList) })));
}

const { useState: useState$3, useCallback: useCallback$1 } = React;
function useSelectedBadge(badges) {
    const [_badge, _setBadge] = useState$3(undefined);
    const setBadge = useCallback$1((badge) => {
        const resolvedBadge = typeof badge === 'function' ? badge(_badge) : badge;
        if (!resolvedBadge)
            return _setBadge(undefined);
        const foundBadge = badges.find(b => b.id === resolvedBadge.id);
        _setBadge(foundBadge);
    }, [badges]);
    return [_badge, setBadge];
}

const { useMemo: useMemo$1, useCallback, useEffect: useEffect$1, useState: useState$2 } = React;
const { Avatar: { default: Avatar, Sizes }, DiscordTag, Form: { FormItem }, Margins, ClassModules } = Discord$1;
function SettingsUser({ BDFDB, userId, data, onSave, addBadge, deleteUser }) {
    const { badges } = data;
    const user = useMemo$1(() => ZLibrary$1.DiscordModules.UserStore.getUser(userId) ?? {
        username: 'Unknown',
        avatar: React.createElement(DefaultIcon, null),
        get tag() { return "Unknown#0000"; }
    }, [userId]);
    const [selectedBadge, setSelectedBadge] = useSelectedBadge(badges);
    const { AccountDetails, Titles, UserProfileHeader } = ClassModules;
    const onBadgeClicked = useCallback((badge) => {
        return setSelectedBadge(selectedBadge && badge.id === selectedBadge.id ? null : badge);
    }, [selectedBadge, data]);
    const onBadgeUpdate = useCallback((badge) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        const newBadges = badges.map(b => b.id === selectedBadge.id ? badge : b);
        console.log('Saving new badges', newBadges);
        onSave(newBadges);
        setSelectedBadge(undefined);
    }, [selectedBadge, data, onSave]);
    const onBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(newBadges.findIndex(b => b.id === selectedBadge.id), 1);
        setSelectedBadge(b => (b && badges[b.index - 1]) ?? badges[badges.length - 1]);
        newBadges.length === 0 ? deleteUser() : onSave(newBadges);
    }, [data, onSave, selectedBadge]);
    return (React.createElement(FormItem, { "data-setting-for": userId, className: classNames(Margins.marginBottom20, 'settings-user') },
        React.createElement("div", { className: "user-presentation" },
            React.createElement("figure", { className: classNames(AccountDetails.avatarWrapper, 'avatar') },
                React.createElement(Avatar, { src: BDFDB.UserUtils.getAvatar(userId), className: classNames(AccountDetails.avatar, 'avatar'), size: Sizes.SIZE_56 })),
            React.createElement(DiscordTag, { user: user, className: classNames(Titles.h1, AccountDetails.nameTag, Titles.defaultColor), discriminatorClassName: UserProfileHeader.discriminator }),
            React.createElement(SettingsBadgeList, { BDFDB: BDFDB, user: user, data: data, onAddBadgeClick: addBadge, onBadgeClick: onBadgeClicked })),
        selectedBadge && React.createElement(SettingsBadge, { badge: selectedBadge, user: user, onUpdate: onBadgeUpdate, onDelete: onBadgeDelete })));
}

const createBDD = () => window.BDD = {
    findNodeByIncludingClassName(className, node = document.body) {
        return node.querySelector(`[class*="${className}"]`);
    },
    findModuleByIncludes(displayName, returnDisplayNamesOnly = false) {
        const modules = window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
        if (!returnDisplayNamesOnly)
            return modules;
        return modules.map(module => module.default.displayName).sort();
    },
    findClassModuleContainingClass(className) {
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
    },
    findModule(args, returnDisplayNamesOnly = false) {
        const module = typeof args === 'string' ? query({ name: args }) : query({ props: args });
        if (!module)
            return module;
        return returnDisplayNamesOnly ?
            Array.isArray(module) ?
                module.map(m => m.default?.displayName || m.displayName) :
                module.default?.displayName || module.displayName
            : module;
    },
    async findUserByTag(tag, BDFDB) {
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
};

const BDD = createBDD();
const { Button, TextInput, Shakeable } = Discord;
const { useState: useState$1, createRef, useEffect } = React;
function AddUser({ BDFDB, onSubmit }) {
    const [userString, setUserString] = useState$1("");
    const [errorLabel, setErrorLabel] = useState$1(undefined);
    const shakeable = createRef();
    useEffect(() => {
        if (shakeable.current && errorLabel)
            shakeable.current.shake(300, 1);
    }, [errorLabel]);
    const onSend = async () => {
        const user = (/.+#[0-9]{4}/.test(userString) ? BDFDB.LibraryModules.UserStore.findByTag(userString.split("#").slice(0, -1).join("#"), userString.split("#").pop()) :
            /\d{18}/.test(userString) ? ZLibrary$1.DiscordModules.UserStore.getUser(userString) :
                await BDD.findUserByTag(userString, BDFDB));
        if (!user)
            return setErrorLabel("User not found");
        onSubmit(user);
    };
    return (React.createElement(Shakeable, { ref: shakeable, className: "add-user", ...{ "data-error": errorLabel } },
        React.createElement(TextInput, { placeholder: "Username, tag or id", onKeyDown: e => (e.key === 'Enter' || e.key === 'NumpadEnter') && onSend(), onChange: v => {
                setUserString(v);
                if (errorLabel)
                    setErrorLabel(undefined);
            }, value: userString }),
        React.createElement(Button, { color: Button.Colors.BRAND_NEW, onClick: onSend }, "Add user")));
}

const { FormTitle } = Discord.Form;
const { Section, Item } = Form;
const { useState, useMemo } = React;
const getNewBadge = (badges, userId) => ({
    id: Date.now().toString(),
    index: 0,
    tooltip: `${ZLibrary$1.DiscordModules.UserStore.getUser(userId).tag}'s Badge`,
    src: "https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif",
});
const SettingsPanel = ({ BDFDB, defaults, set, ...settings }) => {
    const [allowVerified, setAllowVerified] = useState(settings.allowVerified ?? defaults.allowVerified);
    const users = useMemo(() => settings.users || defaults.users, [settings, settings.users, defaults.users]);
    const userComponents = useMemo(() => Object.entries(users).map(([userId, data]) => (React.createElement(SettingsUser, { ...{ userId, data, BDFDB }, onSave: badges => set({ users: { ...users, [userId]: { ...data, badges } } }), addBadge: () => set({ users: { ...users, [userId]: { ...data, badges: [...data.badges, getNewBadge(data.badges, userId)] } } }), deleteUser: () => {
            const newUsers = { ...users };
            delete newUsers[userId];
            set({ users: newUsers });
        } }))), [settings, users, set]);
    return (React.createElement("section", { id: `${name}-settings`, className: "settings" },
        React.createElement(Section, { title: "Allow Discord Community Programs", className: classNames('allow-discord-community-programs') },
            React.createElement(Item, { className: 'vertical' },
                React.createElement(Item, { className: 'horizontal' },
                    React.createElement(FormTitle, null, titles.allowVerified),
                    React.createElement(Setting, { key: "allowVerified", value: settings.allowVerified, set: set, onChange: v => typeof v === 'boolean' && setAllowVerified(v), titles: titles })),
                allowVerified && (React.createElement(Item, null,
                    React.createElement(FormTitle, null, titles.allowVerifiedInvite),
                    React.createElement(Setting, { key: "allowVerifiedInvite", value: settings.allowVerifiedInvite, set: set, titles: titles }))),
                React.createElement(Item, { className: 'horizontal' },
                    React.createElement(FormTitle, null, titles.allowPartneredInvite),
                    React.createElement(Setting, { key: "allowPartneredInvite", value: settings.allowPartneredInvite, set: set, titles: titles })))),
        React.createElement(Section, { className: classNames('custom-badges'), title: "Cusom Badges" },
            userComponents,
            React.createElement(AddUser, { BDFDB: BDFDB, onSubmit: user => set({ users: { ...users, [user.id]: { badges: [getNewBadge(users[user.id]?.badges ?? [], user.id)] } } }) }))));
};

const styles = ".hidden {\n  display: none;\n}\n\n.vertical {\n  flex-direction: column;\n  gap: 1rem;\n}\n.vertical .center {\n  place-items: center;\n}\n\n.horizontal {\n  flex-direction: row;\n}\n.horizontal .center {\n  place-content: center;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container {\n  display: flex;\n  flex-direction: row;\n}\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}\n\nsection.settings div[class*=container] > div[class*=labelRow] + div[class*=divider] {\n  display: none;\n}\nsection.settings div[class*=container] {\n  margin-bottom: 0;\n}\nsection.settings h5 {\n  margin-bottom: 0;\n}\nsection.settings div[class*=sectionTitle] {\n  margin-bottom: 1rem;\n}\nsection.settings div[class*=sectionTitle] h5 {\n  font-size: 1.25em;\n  font-weight: bolder;\n}\nsection.settings .add-badge {\n  margin-left: 1rem;\n  cursor: pointer;\n  z-index: 2000;\n}\n\n.user-presentation {\n  display: grid;\n  grid-template-areas: \"avatar tag\" \"avatar badgeList\";\n  grid-template-rows: auto 3rem;\n  grid-template-columns: 4em 1fr;\n}\n.user-presentation .avatar {\n  grid-area: avatar;\n  display: grid;\n  margin: unset;\n}\n.user-presentation .avatar img {\n  border-radius: 50%;\n  height: 100%;\n  width: 100%;\n  object-fit: contain;\n}\n.user-presentation .tag {\n  grid-area: tag;\n  display: flex;\n}\n.user-presentation button.delete {\n  grid-area: tag;\n  width: fit-content;\n}\n.user-presentation div[class*=clickable]:not(.danho-badge.custom) {\n  opacity: 0.45;\n}\n\n.add-user {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  gap: 0.5rem;\n}\n.add-user div[class*=inputWrapper] {\n  flex: 1;\n}\n.add-user button {\n  margin-left: auto;\n}\n\n.settings-user {\n  padding: 1em;\n  border-radius: 0.25em;\n  display: grid;\n  gap: 1em;\n}\n.settings-user:nth-child(2n) {\n  --modal-background-secondary: var(--modal-footer-background);\n  background-color: var(--modal-background-secondary);\n}\n\n.settings-badge-list {\n  counter-set: badge-counter -1;\n}\n.settings-badge-list .danho-badge::after {\n  counter-increment: badge-counter;\n  content: counter(badge-counter) !important;\n  position: relative !important;\n  color: var(--text-muted, #a3a6aa) !important;\n  top: 0.25em;\n  transform: unset !important;\n  font-size: initial !important;\n}\n\n.danho-badge {\n  position: relative;\n  display: grid;\n  place-items: center;\n  box-sizing: border-box;\n}";

const allowVerified = false;
const allowVerifiedInvite = false;
const allowPartneredInvite = false;
const users = {
	"245572699894710272": {
		premiumSince: null,
		boosterSince: null,
		badges: [
			{
				id: "1653656404017",
				tooltip: "Pingu Developer",
				index: 3,
				src: "https://cdn.discordapp.com/attachments/773807780883726359/977895822291238942/Pingu_Developer.png",
				href: "https://google.com"
			}
		]
	},
	"361815289278627851": {
		premiumSince: null,
		badges: [
			{
				id: "1653656423234",
				tooltip: "Sussie Baka",
				index: 0,
				src: "https://media.discordapp.net/attachments/911311077130776577/977273608823005234/IMG_1840.jpg"
			}
		]
	}
};
const settings = {
	allowVerified: allowVerified,
	allowVerifiedInvite: allowVerifiedInvite,
	allowPartneredInvite: allowPartneredInvite,
	users: users
};

class DanhoCustomBadge extends DanhoPlugin {
    constructor() {
        super(...arguments);
        this.settingsPanel = (props) => {
            return React.createElement(SettingsPanel, { ...props, BDFDB: this.BDFDB });
        };
    }
    async start() {
        await super.start({
            after: {
                default: [
                    { selector: "UserProfileBadgeList", isModal: true },
                ]
            }
        });
    }
    patchUserProfileBadgeList({ args: [props], result }) {
        if (!Array.isArray(result.props.children))
            return this.logger.warn('UserProfileBadgeList children is not an array');
        const ref = $(s => s.getElementFromInstance(result, true), false);
        if (!ref.length)
            return console.log("No ref element");
        const userSettings = this.getUserSettings(props.user.id);
        if (!userSettings)
            return;
        for (const { index, tooltip, ...props } of userSettings.badges) {
            const badge = (() => {
                try {
                    return React.createElement(Badge, { BDFDB: this.BDFDB, tooltipText: tooltip, ...props });
                }
                catch (err) {
                    this.logger.error(err);
                    return null;
                }
            })();
            if (badge)
                result.props.children.splice(index, 0, badge);
        }
        this.storePremiumData(props.user.id, result);
    }
    storePremiumData(userId, badgeList) {
        const userSettings = this.getUserSettings(userId);
        const isPremiumBadge = (text) => text?.includes("Subscriber since") || text?.includes("Server boosting since");
        const premiumBadges = badgeList.props.children.filter(child => isPremiumBadge(child.props.text)).map(child => child.props.text);
        if (!premiumBadges.length) {
            if (!userSettings.premiumSince && !userSettings.boosterSince)
                return;
            userSettings.premiumSince = null;
            userSettings.boosterSince = null;
            return this.saveUserSettings(userId, userSettings);
        }
        const changedProps = premiumBadges.filter(text => {
            const prop = text.includes("Subscriber since") ? "premiumSince" : "boosterSince";
            const [yearText, dateText, monthName] = text.replace(',', '').split(' ').reverse();
            const [year, day] = [yearText, dateText].map(text => parseInt(text));
            const month = (() => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return months.indexOf(monthName);
            })();
            const date = new Date(year, month, day).toString();
            if (userSettings[prop] === date.toString())
                return false;
            userSettings[prop] = date.toString();
            return true;
        }).length > 0;
        if (changedProps)
            this.saveUserSettings(userId, userSettings);
    }
    getUserSettings(userId) {
        return this.settings.get().users[userId];
    }
    saveUserSettings(userId, data) {
        const settings = this.settings.get();
        const { users } = settings;
        this.logger.log(`Saving user settings for ${userId}`, data);
        this.data.save("settings", { ...settings, users: { ...users, [userId]: data } });
    }
}
const index = createPlugin({ ...config, styles, settings }, api => new DanhoCustomBadge(api));

module.exports = index;

/*@end @*/
