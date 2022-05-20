/**
 * @name DanhoDiscordV2
 * @description Rework of the original DanhoDiscord plugin
 * @author Danho#2105
 * @version 0.0.0
 * @authorLink https://github.com/Danho#2105
 * @website https://github.com/Zerthox/BetterDiscord-Plugins
 * @source https://github.com/Zerthox/BetterDiscord-Plugins/tree/master/src/DanhoDiscordV2
 * @updateUrl https://raw.githubusercontent.com/Zerthox/BetterDiscord-Plugins/master/dist/bd/DanhoDiscordV2.plugin.js
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

const confirm = (title, content, options = {}) => BdApi.showConfirmationModal(title, content, options);

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

const ZLibrary = window.ZLibrary;
const ZLibrary$1 = ZLibrary;

const BDFDB = window.BDFDB;
const BDFDB$1 = BDFDB;

class ElementSelector {
    constructor() {
        this.result = "";
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

function $(selector, single = true) {
    if (single)
        return new DQuery(selector);
    let elements = (() => {
        if (typeof selector === 'function') {
            selector = selector(new ElementSelector$1(), $);
            console.log('Selector called', selector);
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
        const element = (selector instanceof Node ? selector :
            selector instanceof DQuery ? selector.element :
                document.querySelector(typeof selector === 'function' ? selector(new ElementSelector$1(), $).toString() :
                    selector instanceof ElementSelector$1 ? selector.toString() : selector));
        if (!element)
            console.trace(`%cCould not find element with selector: ${selector}`, "color: lightred; background-color: darkred;");
        this.element = element;
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
}

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
            .data("dnd-name", this.source.props.name));
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
            status: BDFDB$1.UserUtils.getStatus(this.props.userId),
            customStatus: BDFDB$1.UserUtils.getCustomStatus(this.props.userId),
            activity: BDFDB$1.UserUtils.getActivity(this.props.userId), };
    }
    get guildProfile() {
        return { ...this.props.member,
            roles: this.props.member.roles.map(id => this.props.guild.roles[id]).sort((a, b) => b.position - a.position),
            permissions: Object.keys(DiscordPermissionStrings)
                .map(perm => BDFDB$1.UserUtils.can(perm, this.props.userId, this.props.channelId)
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
        this.observations.set('discord-content-change', new ObservationConfig$1('discord-content', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .sibling
            .className('base', 'div')
            .directChild('div')
            .className('content')
            .toString(), function (record, callback) {
            if (!MutationManager.isDirectChild(this.element, record.target))
                return;
            return callback(record);
        }));
        this.observations.set('guild-change', new ObservationConfig$1('guild-list', MutationManager.writeSelector
            .ariaLabel("Servers sidebar", 'nav')
            .ariaLabel('Servers', 'div').toString(), function (record, callback) {
            if (!record.target
                || !(record.target instanceof Element)
                || !record.target.classList.contains('bd-selected')
                || !record.target.classList.value.includes("listItem")
                || record.type !== 'attributes'
                || record.attributeName !== 'class')
                return;
            const [guild] = $(record.target).prop("guild");
            return callback(record, guild);
        }));
        this.observations.set('channel-change', new ObservationConfig$1('channel-content', () => $('main[class*="chatContent"]').parent, function (record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || record.addedNodes[0].tagName !== 'MAIN')
                return;
            const [props] = $(record.target).propsWith("channel");
            return callback(record, props, new ChannelManipulator(record, props.channel));
        }, 'discord-content-change'));
        this.observations.set('user-popout-render', new ObservationConfig$1('user-popout-create', MutationManager.writeSelector
            .id("app-mount", 'div')
            .directChild('div').and.className("layerContainer"), function (record, callback) {
            if (record.type !== 'childList'
                || record.addedNodes.length <= 0
                || !(record.addedNodes[0] instanceof Element)
                || !MutationManager.isDirectChild(this.element, record.addedNodes[0])
                || !record.addedNodes[0].classList.value.includes('layer')
                || !record.addedNodes[0].id.includes("popout"))
                return;
            const [props] = $(record.addedNodes[0]).propsWith("closePopout");
            if (!props)
                return false;
            return callback(record, props, new UserPopoutManipulator(record, props));
        }));
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
        const observer = new MutationObserver(records => {
            group(`on(${key}, observer records)`);
            records.forEach(async (record, i) => {
                console.log(`records[${i}]`, { record, observation });
                const shouldRun = await (async () => {
                    group(`on(${key}), observer records[${i}], shouldRun`);
                    if (observation.dependency) {
                        console.log(`Observation has dependency`, observation.dependency);
                        const dependency = this.observations.get(observation.dependency);
                        try {
                            const dependencyElement = dependency.element;
                            console.log(`Element status`, dependencyElement ? 'exists - returning true' : 'does not exist - throwing error');
                            if (!dependencyElement)
                                throw new Error('Dependency element not in DOM');
                            console.groupEnd();
                            return true;
                        }
                        catch (err) {
                            console.log(`Unable to find dependency element - awaiting promise`, err);
                            return new Promise((resolve, reject) => {
                                try {
                                    console.log(`Awaiting promise`);
                                    this.on(observation.dependency, record => {
                                        if (record.type === 'childList'
                                            && record.addedNodes.length > 0
                                            && [...record.addedNodes.values()].some(node => node instanceof HTMLElement
                                                && $(node).children(observation.discordSelector))) {
                                            console.log(`Dependency element found in promise - resolving true`);
                                            resolve(true);
                                            return false;
                                        }
                                    });
                                }
                                catch (err) {
                                    console.log(`Unable to find dependency element - rejecting`, err);
                                    console.groupEnd();
                                    reject(err);
                                }
                            });
                        }
                    }
                    console.log(`Observation has no dependency - return true`);
                    console.groupEnd();
                    return true;
                })();
                if (!shouldRun)
                    return;
                observation.setupCallback(record, (...args) => {
                    var cached = this.observationCache.get(key);
                    const [_, ...noRecord] = args;
                    console.log(`Observation callback`, noRecord, cached);
                    if (cached && cached[0] == noRecord[0]) {
                        console.log(`Doublicate observation`);
                        return false;
                    }
                    const successful = callback(...args);
                    if (successful)
                        observation.hasRan = true;
                    this.observations.set(key, observation);
                    this.observationCache.set(key, noRecord);
                    return successful;
                });
            });
            console.groupEnd();
        });
        console.log(`Observer constructed`, observer);
        const selected = $(observation.discordSelector);
        if (!selected.element) {
            console.error(`Observation ${key} could not find selector ${observation.preferredSelector}`);
            return this;
        }
        selected.attr('data-mutation-manager-id', observation.preferredSelector);
        console.log(`Element selected`, selected);
        observer.observe(selected.element, {
            attributes: true,
            subtree: true,
            childList: true,
        });
        observation.ready = true;
        this.observers.set(key, observer);
        console.log(`Observer construction complete`, [
            this.observers,
            observer, key, observation, selected,
        ]);
        console.groupEnd();
        return this;
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
const MutationManager$1 = MutationManager;

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
    Array.isArray(selector) ? byProps(...selector) :
        typeof selector === 'string' ? byName(selector) :
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
    const resolvedCallback = plugin[callbackName];
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
    const cancel = plugin.patcher[patchType](module, method, () => console.log('hello'), option);
    const patched = { module, callback: resolvedCallback, method, patchType, option, cancel };
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
        console.clear();
        this.mutationManager = new MutationManager$1();
        this.patches = await initializePatches(this, config);
    }
    stop() {
        this.mutationManager.clear();
        this.patcher.unpatchAll();
    }
    on(observation, callback) {
        return this.mutationManager.on(observation, callback);
    }
    off(observation) {
        return this.mutationManager.off(observation);
    }
}

const name = "DanhoDiscordV2";
const description = "Rework of the original DanhoDiscord plugin";
const author = "Danho#2105";
const version = "0.0.0";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

class DanhoDiscordV2 extends DanhoPlugin {
    async start() {
        super.start();
        const UserProfileModalHeader = byName("UserProfileModalHeader");
        console.log(UserProfileModalHeader);
        const callback = () => {
            this.logger.log('Hello there');
            return React.createElement("div", null, "Hello");
        };
        this.patcher.after(UserProfileModalHeader, "default", callback);
    }
    async patchUserProfileBadgeList({ args: [props], result }) {
        console.log('UserProfileBadgeList', props, result);
        if (!Array.isArray(result.props.children))
            return;
        const ref = $(`.${props.className}`);
        if (!ref.element)
            return;
        const classes = {
            clickable: ref.children(s => s.className("clickable", 'div'), true).classes,
            img: ref.children(s => s.className("profileBadge", 'img'), true).classes
        };
        result.props.children.splice(3, 0, (React.createElement(BDFDB$1.LibraryComponents.TooltipContainer, {
            text: 'Crazy badge bro',
            spacing: 24,
            children: React.createElement(BDFDB$1.LibraryComponents.Clickable, {
                "aria-label": 'Test badge',
                className: `${classes.clickable} test-badge`,
                role: 'button',
                tabIndex: 0,
                children: React.createElement("img", { alt: ' ', "aria-hidden": true, src: "https://media.discordapp.net/attachments/767713017274040350/768002085052088351/PinguDev.png", className: classes.img })
            })
        })));
    }
}
const index = createPlugin(config, api => new DanhoDiscordV2(api));

module.exports = index;

/*@end @*/
