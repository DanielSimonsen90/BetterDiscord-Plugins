/**
 * @name BetterEmojiManagement
 * @version 1.0.1
 * @author DanielSimonsen90
 * @authorLink https://github.com/DanielSimonsen90
 * @description Handle emojis better like favoring favorite emojis on search, removing your bad emojis, and more.
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/BetterEmojiManagement
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

let meta = {
  "name": "better-emoji-management",
  "version": "1.0.1",
  "description": "Handle emojis better like favoring favorite emojis on search, removing your bad emojis, and more.",
  "author": "DanielSimonsen90"
};
'use strict';

const getMeta = () => {
    if (meta) {
        return meta;
    }
    else {
        throw Error("Accessing meta before initialization");
    }
};
const setMeta = (newMeta) => {
    meta = newMeta;
};

const load = (key) => BdApi.Data.load(getMeta().name, key);
const save = (key, value) => BdApi.Data.save(getMeta().name, key, value);

const checkObjectValues = (target) => target !== window && target instanceof Object && target.constructor?.prototype !== target;
const byName$1 = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byKeys$1 = (...keys) => {
    return (target) => target instanceof Object && keys.every((key) => key in target);
};
const byProtos = (...protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource = (...fragments) => {
    return (target) => {
        while (target instanceof Object && "$$typeof" in target) {
            target = target.render ?? target.type;
        }
        if (target instanceof Function) {
            const source = target.toString();
            const renderSource = target.prototype?.render?.toString();
            return fragments.every((fragment) => typeof fragment === "string" ? (source.includes(fragment) || renderSource?.includes(fragment)) : (fragment(source) || renderSource && fragment(renderSource)));
        }
        else {
            return false;
        }
    };
};

const confirm = (title, content, options = {}) => BdApi.UI.showConfirmationModal(title, content, options);
const mappedProxy = (target, mapping) => {
    const map = new Map(Object.entries(mapping));
    return new Proxy(target, {
        get(target, prop) {
            return target[map.get(prop) ?? prop];
        },
        set(target, prop, value) {
            target[map.get(prop) ?? prop] = value;
            return true;
        },
        deleteProperty(target, prop) {
            delete target[map.get(prop) ?? prop];
            map.delete(prop);
            return true;
        },
        has(target, prop) {
            return map.has(prop) || prop in target;
        },
        ownKeys() {
            return [...map.keys(), ...Object.keys(target)];
        },
        getOwnPropertyDescriptor(target, prop) {
            return Object.getOwnPropertyDescriptor(target, map.get(prop) ?? prop);
        },
        defineProperty(target, prop, attributes) {
            Object.defineProperty(target, map.get(prop) ?? prop, attributes);
            return true;
        }
    });
};

const find = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
    defaultExport: resolve,
    searchExports: entries
});
const byName = (name, options) => find(byName$1(name), options);
const byKeys = (keys, options) => find(byKeys$1(...keys), options);
const demangle = (mapping, required, proxy = false) => {
    const req = required ?? Object.keys(mapping);
    const found = find((target) => (checkObjectValues(target)
        && req.every((req) => Object.values(target).some((value) => mapping[req](value)))));
    return proxy ? mappedProxy(found, Object.fromEntries(Object.entries(mapping).map(([key, filter]) => [
        key,
        Object.entries(found ?? {}).find(([, value]) => filter(value))?.[0]
    ]))) : Object.fromEntries(Object.entries(mapping).map(([key, filter]) => [
        key,
        Object.values(found ?? {}).find((value) => filter(value))
    ]));
};
let controller = new AbortController();
const waitFor = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.waitForModule(filter, {
    signal: controller.signal,
    defaultExport: resolve,
    searchExports: entries
});
const abort = () => {
    controller.abort();
    controller = new AbortController();
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);

const patch$1 = (type, object, method, callback, options) => {
    const original = object?.[method];
    if (!(original instanceof Function)) {
        throw TypeError(`patch target ${original} is not a function`);
    }
    const cancel = BdApi.Patcher[type](getMeta().name, object, method, options.once ? (...args) => {
        const result = callback(cancel, original, ...args);
        cancel();
        return result;
    } : (...args) => callback(cancel, original, ...args));
    if (!options.silent) {
        log(`Patched ${type} ${options.name ?? String(method)}`);
    }
    return cancel;
};
const instead = (object, method, callback, options = {}) => patch$1("instead", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
const after = (object, method, callback, options = {}) => patch$1("after", object, method, (cancel, original, context, args, result) => callback({ cancel, original, context, args, result }), options);
let menuPatches = [];
const unpatchAll = () => {
    if (menuPatches.length + BdApi.Patcher.getPatchesByCaller(getMeta().name).length > 0) {
        for (const cancel of menuPatches) {
            cancel();
        }
        menuPatches = [];
        BdApi.Patcher.unpatchAll(getMeta().name);
        log("Unpatched all");
    }
};

const inject = (styles) => {
    if (typeof styles === "string") {
        BdApi.DOM.addStyle(getMeta().name, styles);
    }
};
const clear = () => BdApi.DOM.removeStyle(getMeta().name);

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$1("Store", "connectStores"),
    Dispatcher: byProtos("dispatch"),
    Store: byProtos("emitChange"),
    BatchedStoreListener: byProtos("attach", "detach"),
    useStateFromStores: bySource("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);

const { React } = BdApi;
const classNames = /* @__PURE__ */ find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);

const Common = /* @__PURE__ */ byKeys(["Button", "Switch", "Select"]);

const Button$1 = Common.Button;

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

const { Menu, Group: MenuGroup, Item: MenuItem, Separator: MenuSeparator, CheckboxItem: MenuCheckboxItem, RadioItem: MenuRadioItem, ControlItem: MenuControlItem } = BdApi.ContextMenu;

const queryFiber = (fiber, predicate, direction = "up" , depth = 30) => {
    if (depth < 0) {
        return null;
    }
    if (predicate(fiber)) {
        return fiber;
    }
    if (direction === "up"  || direction === "both" ) {
        let count = 0;
        let parent = fiber.return;
        while (parent && count < depth) {
            if (predicate(parent)) {
                return parent;
            }
            count++;
            parent = parent.return;
        }
    }
    if (direction === "down"  || direction === "both" ) {
        let child = fiber.child;
        while (child) {
            const result = queryFiber(child, predicate, "down" , depth - 1);
            if (result) {
                return result;
            }
            child = child.sibling;
        }
    }
    return null;
};
const findOwner = (fiber, depth = 50) => {
    return queryFiber(fiber, (node) => node?.stateNode instanceof React.Component, "up" , depth);
};
const forceFullRerender = (fiber) => new Promise((resolve) => {
    const owner = findOwner(fiber);
    if (owner) {
        const { stateNode } = owner;
        instead(stateNode, "render", () => null, { once: true, silent: true });
        stateNode.forceUpdate(() => stateNode.forceUpdate(() => resolve(true)));
    }
    else {
        resolve(false);
    }
});

const SettingsContainer = ({ name, children, onReset }) => (React.createElement(FormSection, null,
    children,
    onReset ? (React.createElement(React.Fragment, null,
        React.createElement(FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
        React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                }) }, "Reset")))) : null));

class SettingsStore {
    constructor(defaults, onLoad) {
        this.listeners = new Set();
        this.update = (settings) => {
            Object.assign(this.current, typeof settings === "function" ? settings(this.current) : settings);
            this._dispatch(true);
        };
        this.addReactChangeListener = this.addListener;
        this.removeReactChangeListener = this.removeListener;
        this.defaults = defaults;
        this.onLoad = onLoad;
    }
    load() {
        this.current = { ...this.defaults, ...load("settings") };
        this.onLoad?.();
        this._dispatch(false);
    }
    _dispatch(save$1) {
        for (const listener of this.listeners) {
            listener(this.current);
        }
        if (save$1) {
            save("settings", this.current);
        }
    }
    reset() {
        this.current = { ...this.defaults };
        this._dispatch(true);
    }
    delete(...keys) {
        for (const key of keys) {
            delete this.current[key];
        }
        this._dispatch(true);
    }
    useCurrent() {
        return useStateFromStores([this], () => this.current, undefined, () => false);
    }
    useSelector(selector, deps, compare) {
        return useStateFromStores([this], () => selector(this.current), deps, compare);
    }
    useState() {
        return useStateFromStores([this], () => [
            this.current,
            this.update
        ]);
    }
    useStateWithDefaults() {
        return useStateFromStores([this], () => [
            this.current,
            this.defaults,
            this.update
        ]);
    }
    useListener(listener, deps) {
        React.useEffect(() => {
            this.addListener(listener);
            return () => this.removeListener(listener);
        }, deps ?? [listener]);
    }
    addListener(listener) {
        this.listeners.add(listener);
        return listener;
    }
    removeListener(listener) {
        this.listeners.delete(listener);
    }
    removeAllListeners() {
        this.listeners.clear();
    }
}
const createSettings = (defaults, onLoad) => new SettingsStore(defaults, onLoad);

const createPlugin = (plugin) => (meta) => {
    setMeta(meta);
    const { start, stop, styles, Settings, SettingsPanel } = (plugin instanceof Function ? plugin(meta) : plugin);
    Settings?.load();
    return {
        start() {
            log("Enabled");
            inject(styles);
            start?.();
        },
        stop() {
            abort();
            unpatchAll();
            clear();
            stop?.();
            log("Disabled");
        },
        getSettingsPanel: SettingsPanel ? () => (React.createElement(SettingsContainer, { name: meta.name, onReset: Settings ? () => Settings.reset() : null },
            React.createElement(SettingsPanel, null))) : null
    };
};

async function WaitForEmojiPicker(callback) {
    return waitFor(bySource(...['showEmojiFavoriteTooltip']), { resolve: false }).then(module => {
        const key = 'default' in module ? 'default' : Object.keys(module)[0];
        return callback(module, key);
    });
}

const createPatcherCallback = (callback) => callback;
const createPatcherAfterCallback = (callback) => callback;

class ElementSelector {
    constructor() {
        this.result = "";
    }
    static getElementFromReactInstance(instance, allowMultiple = false) {
        return getElementFromReactInstance(instance, allowMultiple);
    }
    static getSelectorFromElement(element) {
        const selector = new ElementSelector().tagName(element.tagName.toLowerCase()).and;
        if (element.id)
            selector.id(element.id).and;
        if (element.className)
            selector.className(element.className).and;
        if (element.getAttribute("aria-label"))
            selector.ariaLabel(element.getAttribute("aria-label")).and;
        if (element.getAttribute("role"))
            selector.role(element.getAttribute("role")).and;
        if ('dataset' in element && element.dataset instanceof DOMStringMap) {
            for (const prop in element.dataset) {
                selector.data(prop, element.dataset[prop]).and;
            }
        }
        return selector.toString();
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
    data(prop, value) {
        this.result += `[data-${prop}${value ? `="${value}"` : ''}] `;
        return this;
    }
    dataIncludes(prop, value) {
        this.result += `[data-${prop}*="${value}"] `;
        return this;
    }
    role(role, tagName) {
        this.result += `${tagName ?? ''}[role="${role}"] `;
        return this;
    }
    type(type, tagName) {
        this.result += `${tagName ?? ''}[type="${type}"] `;
        return this;
    }
    nth(index) {
        this.result += `:nth-child(${index}) `;
        return this;
    }
    toString() {
        return this.result;
    }
}
function getElementFromReactInstance(instance, allowMultiple = false) {
    const selector = new ElementSelector();
    if (instance.type && !instance.type.toString().includes("function"))
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
    if (single) {
        const dq = new DQuery(selector);
        return dq.element ? dq : undefined;
    }
    let elements = (() => {
        if (typeof selector === 'function') {
            selector = selector(new ElementSelector(), $);
        }
        if (selector instanceof ElementSelector || typeof selector === 'string')
            return [...document.querySelectorAll(selector.toString()).values()];
        else if (selector instanceof DQuery) {
            return [selector.element];
        }
        return (Array.isArray(selector) ? selector : [selector]);
    })();
    return elements.filter(Boolean).map(el => new DQuery(el));
}
class DQuery {
    constructor(selector) {
        this.selector = selector;
        if (selector) {
            const element = (selector instanceof HTMLElement ? selector :
                selector instanceof DQuery ? selector.element :
                    selector instanceof ElementSelector || typeof selector === 'string' ? document.querySelector(selector.toString()) :
                        typeof selector === 'function' ? new DQuery(selector(new ElementSelector(), $)).element :
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
    setStyleProperty(key, value) {
        key = key.toString();
        const style = this.attr('style') ?? '';
        if (!style.includes(key))
            return this.attr('style', `${this.attr('style') ?? ''}${key}: ${value};`, false);
        const regex = new RegExp(`${key}: [^;]*;`, 'g');
        this.attr('style', style.replace(regex, `${key}: ${value};`), false);
        return;
    }
    addClass(className) {
        this.element.classList.add(className);
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
    removeClass(className) {
        this.element.classList.remove(className);
        return this;
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
        if (!this.element)
            return single ? undefined : [];
        if (!selector)
            return single ? new DQuery(this.element.children[0]) : [...this.element.children].map(child => new DQuery(child));
        selector = typeof selector === 'function' ? selector(new ElementSelector(), $) : selector;
        if (typeof selector === 'string' || selector instanceof ElementSelector) {
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
        return getElement(this.element) ? $(getElement(this.element)) : undefined;
    }
    get firstChild() {
        return this.children()[0];
    }
    get lastChild() {
        const children = this.children();
        return children[children.length - 1];
    }
    hasChildren() {
        return this.element.children.length > 0;
    }
    grandChildren(selector, single) {
        const grandChildren = this.children().map(child => child.children(selector, single)).flat();
        return (single ? grandChildren[0] : grandChildren);
    }
    ancestor(selector) {
        const getAnscestorSelector = () => {
            const _selector = typeof selector === 'function' ? selector(new ElementSelector(), $) : selector;
            if (typeof _selector === 'string')
                return _selector;
            if (_selector instanceof ElementSelector)
                return _selector.toString();
            if (_selector instanceof DQuery)
                return ElementSelector.getSelectorFromElement(_selector.element);
            if (_selector instanceof HTMLElement)
                return ElementSelector.getSelectorFromElement(_selector);
            return undefined;
        };
        const anscestorSelector = getAnscestorSelector();
        if (!anscestorSelector)
            return undefined;
        return new DQuery(this.element.closest(anscestorSelector));
    }
    get fiber() {
        const key = Object.keys(this.element).find(key => key.startsWith('__reactFiber$'));
        return key ? this.element[key] : undefined;
    }
    get props() {
        try {
            if (!this.fiber)
                return null;
            const fiberProps = this.fiber.memoizedProps;
            if (fiberProps)
                return fiberProps;
            const propsKey = Object.keys(this.element).find(key => key.startsWith('__reactProps$'));
            if (propsKey)
                return this.element[propsKey];
            return null;
        }
        catch (err) {
            console.error(err, this);
            return null;
        }
    }
    set props(value) {
        this.fiber.pendingProps = value;
    }
    prop(key, ...cycleThrough) {
        const getPropThroughFiber = (obj, path) => {
            if (obj === undefined || obj === null)
                return undefined;
            else if (obj[key])
                return [obj[key], path];
            if (obj.children) {
                if (Array.isArray(obj.children)) {
                    for (let i = 0; i < obj.children.length; i++) {
                        const result = getPropThroughFiber(obj.children[i], [...path, `children`, i.toString()]);
                        if (result)
                            return result;
                    }
                }
                else {
                    const result = getPropThroughFiber(obj.children, [...path, 'children']);
                    if (result)
                        return result;
                }
            }
            if (obj.props) {
                const result = getPropThroughFiber(obj.props, [...path, 'props']);
                if (result)
                    return result;
            }
            if (cycleThrough) {
                for (const prop of cycleThrough) {
                    const result = getPropThroughFiber(obj[prop], [...path, prop]);
                    if (result)
                        return result;
                }
            }
            return undefined;
        };
        const getPropThroughDOM = (el, path) => {
            if (el === undefined || el === null)
                return undefined;
            const dq = el instanceof HTMLElement ? new DQuery(el) : new DQuery(ElementSelector.getSelectorFromElement(el));
            if (!dq.element)
                return undefined;
            const props = dq.props;
            if (!props)
                return undefined;
            else if (props[key])
                return [props[key], path];
            if (dq.hasChildren()) {
                for (let i = 0; i < el.children.length; i++) {
                    const result = getPropThroughDOM(el.children[i], [...path, i.toString()]);
                    if (result)
                        return result;
                }
            }
            if (cycleThrough) {
                for (const prop of cycleThrough) {
                    const result = getPropThroughDOM(el[prop], [...path, prop]);
                    if (result)
                        return result;
                }
            }
            return undefined;
        };
        try {
            if (!this.element)
                return undefined;
            return getPropThroughFiber(this.fiber.memoizedProps, [])
                ?? getPropThroughDOM(this.element, []);
        }
        catch (err) {
            console.error(err, this);
            return undefined;
        }
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
    propFromParent(key, ...cycleThrough) {
        if (!this.element || !this.fiber)
            return [undefined, undefined];
        const getProp = (obj, path) => {
            if (obj === undefined || obj === null)
                return undefined;
            else if (obj[key])
                return [obj[key], path];
            if (obj.return) {
                const result = getProp(obj.return, [...path, 'return']);
                if (result)
                    return result;
            }
            if (obj.memoizedProps) {
                const result = getProp(obj.memoizedProps, [...path, 'memoizedProps']);
                if (result)
                    return result;
            }
            if (obj.pendingProps) {
                const result = getProp(obj.pendingProps, [...path, 'pendingProps']);
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
        try {
            return getProp(this.fiber.return, []) ?? [undefined, undefined];
        }
        catch (err) {
            console.error(err, this);
            return [undefined, undefined];
        }
    }
    attr(key, value, remove) {
        if (!this.element)
            return this;
        if (!key)
            return [...this.element.attributes];
        if (value === undefined && remove === undefined)
            return this.element.getAttribute(key);
        if (remove) {
            this.element.removeAttribute(key);
            return this;
        }
        this.element.setAttribute(key, value);
        return this;
    }
    unmount() {
        this.element.remove();
    }
    get hidden() {
        return this.element.hidden;
    }
    get visible() {
        return !this.hidden;
    }
    hide() {
        this.element.style.display = 'none';
    }
    show() {
        this.element.style.display = '';
    }
    appendHtml(html) {
        this.element.appendChild(createElement(html));
        return this;
    }
    appendElements(elements) {
        elements.forEach(element => {
            this.element.appendChild(element instanceof DQuery ? element.element : element);
        });
        return this;
    }
    appendComponent(component, wrapperProps) {
        this.element.appendChild(createElement("<></>", wrapperProps));
        const wrapper = this.element.lastChild;
        BdApi.ReactDOM.render(component, wrapper);
        return this;
    }
    replaceWithComponent(component) {
        BdApi.ReactDOM.render(component, this.element);
        return this;
    }
    insertComponent(position, component) {
        this.element.insertAdjacentElement(position, createElement("<></>"));
        const wrapper = this.parent.children(".bdd-wrapper", true).element;
        BdApi.ReactDOM.render(component, wrapper);
        return this;
    }
    prependHtml(html) {
        this.element.insertAdjacentHTML('afterbegin', html);
        return this;
    }
    prependComponent(component) {
        this.element.insertAdjacentElement('afterbegin', createElement("<></>"));
        const wrapper = this.element.firstChild;
        BdApi.ReactDOM.render(component, wrapper);
        return this;
    }
    on(event, listener, options) {
        this.element.addEventListener(event, listener.bind(this), options);
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
function createElement(html, props = {}, target) {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        if ('className' in props)
            props.class = `bdd-wrapper ${props.className}`;
        else
            props.class = 'bdd-wrapper';
        html = `<div ${Object.entries(props).reduce((result, [key, value]) => {
            return result + `${key}="${value}" `;
        }, "")}></div>`;
    }
    const element = (() => {
        if (html.startsWith('<')) {
            const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
            return element;
        }
        return Object.assign(document.createElement(html), props);
    })();
    return element;
}

function BinIcon() {
    return (React.createElement("svg", { "aria-hidden": false, width: "16", height: "16", viewBox: "0 0 24 24" },
        React.createElement("path", { fill: "currentColor", fillRule: "evenodd", clipRule: "evenodd", d: "M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V8H23V10H1V8H3V6ZM5 6H19V8H5V6ZM3 10H21V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10ZM5 10V20H19V10H5ZM9 12H11V18H9V12ZM13 12H15V18H13V12Z" })));
}

const Settings = createSettings({
    bannedEmojis: new Array(),
    enableFavorFavoriteEmojis: true,
    enableBannedEmojis: true,
    acceptBannedEmojisBeta: false,
});
const titles = {
    enableBannedEmojis: 'Ban your bad emojis (push them to the end)',
    enableFavorFavoriteEmojis: 'Push favorite emojis first on search results',
    bannedEmojis: 'Banned emojis',
    acceptBannedEmojisBeta: `Notice: The "Banned Emojis" feature is enabled. This may cause crashes to your client.`
};

const KNOWN_EXPRESSION_PICKER_CONTEXTMENU_ITEMS_COUNT = 2;
const isBanFeatureEnabled = () => Settings.current.enableBannedEmojis;
const sortBannedEmojisToEnd = function (emojis) {
    const banned = Settings.current.bannedEmojis.map(e => e.id);
    return emojis.sort((a, b) => {
        const aIsBanned = banned.includes(a.id);
        const bIsBanned = banned.includes(b.id);
        return (aIsBanned && !bIsBanned ? 1
            : !aIsBanned && bIsBanned ? -1
                : 0);
    });
};
const sortBannedEmojisOnSearch = createPatcherCallback(({ args, original: __getStoreSearchResults }) => {
    const emojis = __getStoreSearchResults(...args);
    return sortBannedEmojisToEnd(emojis);
});
const addBannedTagToEmoji = createPatcherCallback(({ args: [props], original: emojiPicker }) => {
    const bannedEmojis = Settings.current.bannedEmojis.map(e => e.id);
    const result = emojiPicker(props);
    result.props.children = result.props.children.map((row) => {
        if (!row.props.descriptor)
            return row;
        const emojiId = row.props.descriptor.emoji.id;
        const isBanned = bannedEmojis.includes(emojiId);
        return !isBanned ? row : {
            ...row,
            props: {
                ...row.props,
                ['data-banned-emoji']: true
            }
        };
    });
    return result;
});
const addBannedDataTagToEmojiElement = createPatcherAfterCallback(({ result }) => {
    result.props.children.forEach(row => {
        if (!('data-banned-emoji' in row.props))
            return;
        const emojiId = row.props.descriptor.emoji.id;
        $(`[data-id="${emojiId}"]`).attr('data-banned-emoji', 'true');
    });
});
const renderBanEmojiMenuItem = function (menu, props) {
    const attributes = [...props.target.attributes];
    const name = attributes.find(a => a.name === "data-name")?.value;
    const id = attributes.find(a => a.name === "data-id")?.value ?? `default_${name}`;
    const isBanned = Settings.current.bannedEmojis.some(e => e.id === id);
    menu.props.children.props.children.splice(KNOWN_EXPRESSION_PICKER_CONTEXTMENU_ITEMS_COUNT, 2, (React.createElement(React.Fragment, null,
        React.createElement(MenuSeparator, null),
        React.createElement(MenuItem, { id: `emoji-ban_${id}`, label: isBanned ? "Unban Emoji" : "Ban Emoji", action: () => {
                Settings.update({
                    bannedEmojis: isBanned
                        ? Settings.current.bannedEmojis.filter(e => e.id !== id)
                        : [...Settings.current.bannedEmojis, { id, name }]
                });
                $(`[data-id="${id}"]`).attr('data-banned-emoji', isBanned ? undefined : 'true', true).forceUpdate();
            }, color: isBanned ? undefined : "danger", icon: isBanned ? undefined : BinIcon }))));
};
const replaceEmojiStore_getDisambiguatedEmojiContext = createPatcherCallback(({ args, original: getDisambiguatedEmojiContext }) => {
    const result = getDisambiguatedEmojiContext(...args);
    return {
        _original: result,
        getFrequentlyUsedReactionEmojisWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getFrequentlyUsedReactionEmojisWithoutFetchingLatest()); },
        getFrequentlyUsedEmojisWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getFrequentlyUsedEmojisWithoutFetchingLatest()); },
        get favoriteEmojisWithoutFetchingLatest() { return sortBannedEmojisToEnd(result.favoriteEmojisWithoutFetchingLatest); },
        getGroupedCustomEmoji: function () {
            const groupedCustomEmojis = result.getGroupedCustomEmoji();
            return Object.keys(groupedCustomEmojis).reduce((acc, guildId) => {
                acc[guildId] = sortBannedEmojisToEnd(groupedCustomEmojis[guildId]);
                return acc;
            }, {});
        },
        getCustomEmoji: function () { return result.getCustomEmoji(); },
        isFavoriteEmojiWithoutFetchingLatest: function (emojiId) { return result.isFavoriteEmojiWithoutFetchingLatest(emojiId); },
        getById: function (emojiId) { return result.getById(emojiId); },
        getEscapedCustomEmoticonNames: function () { return result.getEscapedCustomEmoticonNames(); },
        getCustomEmoticonRegex: function () { return result.getCustomEmoticonRegex(); },
        getEmojiInPriorityOrderWithoutFetchingLatest: function () { return sortBannedEmojisToEnd(result.getEmojiInPriorityOrderWithoutFetchingLatest()); },
    };
});

function insteadEmojiPicker() {
    if (!isBanFeatureEnabled())
        return;
    return WaitForEmojiPicker((emojiPicker, key) => {
        instead(emojiPicker, key, data => {
            return addBannedTagToEmoji(data);
        }, { name: 'EmojiPicker' });
    });
}

const getEmojiUrl = (emoji, size = 128) => (`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}` +
    `?size=${size}&qualiy=lossless`);
const EmojiStore = byName("EmojiStore");

const GuildStore = byName("GuildStore");

function insteadEmojiStore_getDisambiguatedEmojiContext() {
    if (!isBanFeatureEnabled())
        return;
    return instead(EmojiStore, 'getDisambiguatedEmojiContext', (data) => {
        return replaceEmojiStore_getDisambiguatedEmojiContext(data);
    });
}

function WaitForEmojiPickerContextMenu(callback) {
    return BdApi.ContextMenu.patch('expression-picker', callback);
}

function insteadEmojiPickerContextMenu() {
    if (!isBanFeatureEnabled())
        return;
    return WaitForEmojiPickerContextMenu((menu, targetProps) => {
        renderBanEmojiMenuItem(menu, targetProps);
    });
}

const isFavorFavoriteFeatureEnabled = () => Settings.current.enableFavorFavoriteEmojis;
const favorFavoriteEmojis = createPatcherCallback(({ args, original: __getStoreSearchResults }) => {
    const emojis = __getStoreSearchResults(...args);
    const favorites = EmojiStore.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest;
    return emojis.sort((a, b) => {
        const aIsFavorite = favorites.some(e => e.id === a.id);
        const bIsFavorite = favorites.some(e => e.id === b.id);
        return (aIsFavorite && !bIsFavorite ? -1
            : !aIsFavorite && bIsFavorite ? 1
                : 0);
    });
});

function insteadGetSearchResultsOrder() {
    if (!isBanFeatureEnabled() && !isFavorFavoriteFeatureEnabled())
        return;
    return instead(EmojiStore, "getSearchResultsOrder", (data) => {
        const callbacks = [
            isFavorFavoriteFeatureEnabled() && favorFavoriteEmojis,
            () => data.original(...data.args),
            isBanFeatureEnabled() && sortBannedEmojisOnSearch
        ].filter(Boolean);
        let result = data.args[0];
        for (const callback of callbacks) {
            let args = [...data.args].slice(1);
            result = callback({ ...data, args: [result, ...args] });
        }
        return result;
    });
}

function afterEmojiPicker() {
    if (!isBanFeatureEnabled())
        return;
    return WaitForEmojiPicker((emojiPicker, key) => {
        const cancel = after(emojiPicker, key, data => {
            addBannedDataTagToEmojiElement(data);
        }, { name: 'EmojiPicker' });
        return [cancel, insteadEmojiPickerContextMenu()];
    });
}

function patch() {
    insteadEmojiPicker();
    insteadEmojiStore_getDisambiguatedEmojiContext();
    insteadEmojiPickerContextMenu();
    insteadGetSearchResultsOrder();
    afterEmojiPicker();
}

var ButtonLooks;
(function (ButtonLooks) {
    ButtonLooks[ButtonLooks["BLANK"] = 0] = "BLANK";
    ButtonLooks[ButtonLooks["FILLED"] = 1] = "FILLED";
    ButtonLooks[ButtonLooks["INVERTED"] = 2] = "INVERTED";
    ButtonLooks[ButtonLooks["LINK"] = 3] = "LINK";
    ButtonLooks[ButtonLooks["OUTLINED"] = 4] = "OUTLINED";
})(ButtonLooks || (ButtonLooks = {}));
var ButtonSizes;
(function (ButtonSizes) {
    ButtonSizes[ButtonSizes["ICON"] = 0] = "ICON";
    ButtonSizes[ButtonSizes["LARGE"] = 1] = "LARGE";
    ButtonSizes[ButtonSizes["MAX"] = 2] = "MAX";
    ButtonSizes[ButtonSizes["MEDIUM"] = 3] = "MEDIUM";
    ButtonSizes[ButtonSizes["MIN"] = 4] = "MIN";
    ButtonSizes[ButtonSizes["NONE"] = 5] = "NONE";
    ButtonSizes[ButtonSizes["SMALL"] = 6] = "SMALL";
    ButtonSizes[ButtonSizes["TINY"] = 7] = "TINY";
    ButtonSizes[ButtonSizes["XLARGE"] = 8] = "XLARGE";
})(ButtonSizes || (ButtonSizes = {}));
var Colors;
(function (Colors) {
    Colors[Colors["BLACK"] = 0] = "BLACK";
    Colors[Colors["BRAND"] = 1] = "BRAND";
    Colors[Colors["BRAND_NEW"] = 2] = "BRAND_NEW";
    Colors[Colors["GREEN"] = 3] = "GREEN";
    Colors[Colors["LINK"] = 4] = "LINK";
    Colors[Colors["PRIMARY"] = 5] = "PRIMARY";
    Colors[Colors["RED"] = 6] = "RED";
    Colors[Colors["TRANSPARENT"] = 7] = "TRANSPARENT";
    Colors[Colors["WHITE"] = 8] = "WHITE";
    Colors[Colors["YELLOW"] = 9] = "YELLOW";
})(Colors || (Colors = {}));
const Button = byKeys(["Button"]).Button;
const SecondaryButton = (props) => React.createElement(Button, { ...props, color: Button.Colors.PRIMARY, look: Button.Looks.OUTLINED, "data-type": "secondary" });

const TextInput = byName("TextInput");

const { useState: useState$1 } = React;
function Collapsible({ children, ...props }) {
    const [isOpen, setIsOpen] = useState$1(props.defaultOpen ?? false);
    const disabled = props.disabled ?? false;
    const toggle = () => {
        if (disabled)
            return;
        setIsOpen(!isOpen);
        props.onToggle?.(!isOpen);
        if (isOpen)
            props.onClose?.();
        else
            props.onOpen?.();
    };
    const Title = typeof props.title === 'string' ? React.createElement("h3", null, props.title) : props.title;
    const TitleOpen = typeof props.titleOpen === 'string' ? React.createElement("h3", null, props.titleOpen) : props.titleOpen;
    return (React.createElement("div", { className: `collapsible ${props.className ?? ''}`, "data-open": isOpen, "data-disabled": disabled },
        React.createElement("div", { className: "collapsible__header", onClick: toggle },
            isOpen ? TitleOpen ?? Title : Title,
            React.createElement("span", { style: { display: 'flex' } })),
        React.createElement("div", { className: classNames('collapsible__content', isOpen ? 'visible' : 'hidden') }, children)));
}

function GuildListItem(props) {
    const guildId = React.useMemo(() => 'guildId' in props ? props.guildId : props.guild.id, [props]);
    const guild = React.useMemo(() => 'guild' in props ? props.guild : GuildStore.getGuild(guildId), [guildId]);
    const { children } = props;
    return (React.createElement("div", { className: "guild-list-item" },
        React.createElement("img", { className: "guild-list-item__icon", src: window.DL.Guilds.getIconUrl(guild), alt: guild.name }),
        React.createElement("div", { className: "guild-list-item__content-container" },
            React.createElement("span", { className: "guild-list-item__name" }, guild.name),
            React.createElement("span", { className: "guild-list-item__content" }, children))));
}

const { useState } = React;
function Setting({ setting, settings, set, titles, ...props }) {
    const { beforeChange, onChange, formatValue, type } = props;
    const [v, _setV] = useState(formatValue ? formatValue(settings[setting]) : settings[setting]);
    const setV = (value) => _setV(formatValue ? formatValue(value) : value);
    if (type === undefined ? typeof v === 'boolean' : type === 'switch')
        return (React.createElement(FormSwitch, { className: 'danho-form-switch', key: setting.toString(), note: titles[setting.toString()], value: Boolean(v), hideBorder: true, onChange: inputValue => {
                const checked = beforeChange ? beforeChange(inputValue) : inputValue;
                set({ [setting]: checked });
                onChange?.(checked);
                setV(checked);
            } }));
    if (type === undefined ? typeof v === 'number' : type === 'number')
        return (React.createElement(TextInput, { key: setting.toString(), title: titles[setting], value: v, onChange: inputValue => {
                const value = beforeChange ? beforeChange(Number(inputValue)) : Number(inputValue);
                set({ [setting]: value });
                onChange?.(value);
                setV(value);
            } }));
    if (type === undefined ? typeof v === 'string' : type === 'text')
        return (React.createElement(TextInput, { key: setting.toString(), title: titles[setting], value: v, onChange: inputValue => {
                const value = beforeChange ? beforeChange(inputValue) : inputValue;
                set({ [setting]: value });
                onChange?.(value);
                setV(value);
            } }));
    if (type)
        return (React.createElement("div", { className: "danho-form-switch", key: setting.toString() },
            React.createElement("input", { type: type, key: setting.toString(), value: v, onChange: e => {
                    const value = beforeChange ? beforeChange(e.target.value) : e.target.value;
                    set({ [setting]: value });
                    onChange?.(value);
                    setV(value);
                } }),
            React.createElement(FormText, { className: 'note' }, titles[setting])));
    return (React.createElement("div", { className: 'settings-error' },
        React.createElement("h1", null, "Unknown value type"),
        React.createElement("h3", null,
            "Recieved ",
            typeof v),
        React.createElement("h5", null, JSON.stringify(v))));
}

function BannedEmojiTag({ emojiId, onClick }) {
    const emoji = EmojiStore.getDisambiguatedEmojiContext().getById(emojiId);
    return (React.createElement("li", { id: `banned-emoji__${emoji.id}`, className: "banned-emoji-tag", onClick: onClick },
        React.createElement("img", { className: "emoji jumboable", src: getEmojiUrl(emoji), alt: emoji.name })));
}

function SettingsPanel({ updatePatches }) {
    const [current, set] = Settings.useState();
    React.useEffect(() => {
        updatePatches();
    }, [current.enableBannedEmojis, current.enableFavorFavoriteEmojis]);
    return (React.createElement("div", { className: 'danho-plugin-settings' },
        React.createElement(FormSection, null,
            React.createElement(FormLabel, null, "Features"),
            React.createElement(Setting, { settings: Settings.current, setting: 'enableBannedEmojis', set: set, titles: titles }),
            React.createElement(Setting, { settings: Settings.current, setting: 'enableFavorFavoriteEmojis', set: set, titles: titles })),
        current.enableBannedEmojis && (React.createElement(React.Fragment, null,
            React.createElement(FormDivider, null),
            React.createElement(BannedEmojiSection, null)))));
}
function BannedEmojiSection() {
    const [current, set] = Settings.useState();
    const emojiStoreContext = EmojiStore.getDisambiguatedEmojiContext();
    const bannedEmojis = current.bannedEmojis.map(({ id }) => emojiStoreContext.getById(id));
    const guilds = React.useMemo(() => bannedEmojis.map(({ guildId }) => ({
        id: guildId,
        guild: GuildStore.getGuild(guildId),
        bannedEmojis: bannedEmojis.filter(({ guildId: id }) => id === guildId)
    })), [bannedEmojis]);
    const disableCollapsible = bannedEmojis.length === 0;
    return (React.createElement(FormSection, { className: 'banned-emojis' },
        React.createElement(FormLabel, null, "Banned emojis"),
        React.createElement(Collapsible, { title: disableCollapsible ? 'There are no banned emojis.' : 'View banned emojis', disabled: disableCollapsible },
            React.createElement("ul", { className: "banned-emojis__guilds-list" }, guilds.map(({ guild, bannedEmojis }) => (React.createElement("li", { key: guild.id, className: "banned-emojis__guild-list-item" },
                React.createElement(Collapsible, { title: React.createElement("div", { className: 'banned-emojis__guilds-list-item__header' },
                        React.createElement(GuildListItem, { guild: guild },
                            React.createElement("span", { className: "banned-emojis-count" },
                                bannedEmojis.length,
                                " banned emoji",
                                bannedEmojis.length === 1 ? '' : 's')),
                        React.createElement(SecondaryButton, { onClick: () => {
                                set({
                                    bannedEmojis: current.bannedEmojis
                                        .filter(e => !bannedEmojis.map(e => e.id).includes(e.id))
                                });
                                BdApi.UI.showToast(`Unbanned all emojis from ${guild.name}.`, { type: 'success' });
                            } }, "Unban all")) },
                    React.createElement("ul", { className: "banned-emojis__emojis-list" }, bannedEmojis.map(({ id, name }) => (React.createElement(BannedEmojiTag, { key: id, emojiId: id, onClick: () => BdApi.UI.showConfirmationModal(`Unban ${name}`, React.createElement("div", { className: 'bd-flex bd-flex-column bd-flex-center' },
                            React.createElement("img", { src: getEmojiUrl({ id }), alt: name, className: 'emoji jumboable' }),
                            React.createElement("p", { style: { color: 'var(--text-primary)', marginLeft: '1ch' } },
                                "Are you sure you want to unban ",
                                name,
                                "?")), {
                            danger: true,
                            confirmText: 'Unban',
                            onConfirm: () => set({ bannedEmojis: current.bannedEmojis.filter(e => e.id !== id) })
                        }) }))))))))))));
}

const styles = "[data-banned-emoji=true] {\n  filter: saturate(0.4);\n  border: 1px solid var(--button-danger-background);\n}\n\n.banned-emojis__guilds-list {\n  border: 1px solid var(--background-secondary);\n}\n.banned-emojis__guilds-list-item__header {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n}\n.banned-emojis__emojis-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}";

function updatePatches() {
    unpatchAll();
    patch();
}
const index = createPlugin({
    start() {
        patch();
        if (Settings.current.enableBannedEmojis && !Settings.current.acceptBannedEmojisBeta) {
            const closeNotice = BdApi.UI.showNotice(titles.acceptBannedEmojisBeta, {
                type: 'warning',
                buttons: [{
                        label: 'Disable plugin',
                        onClick: () => {
                            BdApi.Plugins.disable(getMeta().name);
                            closeNotice(false);
                        }
                    }, {
                        label: 'Disable feature',
                        onClick: () => {
                            Settings.update({ enableBannedEmojis: false });
                            closeNotice(false);
                        }
                    }, {
                        label: 'I understand',
                        onClick: () => {
                            Settings.update({ acceptBannedEmojisBeta: true });
                            closeNotice(false);
                        }
                    }]
            });
        }
    },
    styles,
    Settings,
    SettingsPanel: () => SettingsPanel({ updatePatches })
});

module.exports = index;

/*@end @*/
