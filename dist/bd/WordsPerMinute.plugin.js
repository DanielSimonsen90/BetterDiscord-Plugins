/**
 * @name WordsPerMinute
 * @version 1.0.4
 * @author danielsimonsen90
 * @authorLink https://github.com/danielsimonsen90
 * @description View your words per minute while typing your message
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/WordsPerMinute
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
  "name": "words-per-minute",
  "version": "1.0.4",
  "description": "View your words per minute while typing your message",
  "author": "danielsimonsen90",
  "dependencies": {
    "dium": "*",
    "danho-lib": "*"
  }
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
const abort = () => {
    controller.abort();
    controller = new AbortController();
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);

const patch = (type, object, method, callback, options) => {
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
const instead = (object, method, callback, options = {}) => patch("instead", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
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

const Button = Common.Button;

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

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
            React.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                }) }, "Reset")))) : null));

class SettingsStore {
    constructor(defaults, onLoad) {
        this.listeners = new Set();
        this.update = (settings, replace = false) => {
            this.current = typeof settings === "function"
                ? ({ ...(replace ? {} : this.current), ...settings(this.current) })
                : ({ ...(replace ? {} : this.current), ...settings });
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
        this.element.appendChild(createElement$1(html));
        return this;
    }
    appendElements(elements) {
        elements.forEach(element => {
            this.element.appendChild(element instanceof DQuery ? element.element : element);
        });
        return this;
    }
    appendComponent(component, wrapperProps) {
        const wrapper = this.element.appendChild(createElement$1("<></>", wrapperProps));
        BdApi.ReactDOM.render(component, wrapper);
        return this;
    }
    replaceWithComponent(component) {
        BdApi.ReactDOM.render(component, this.element);
        return this;
    }
    insertComponent(position, component) {
        this.element.insertAdjacentElement(position, createElement$1("<></>"));
        const wrapper = this.parent.children(".bdd-wrapper", true).element;
        BdApi.ReactDOM.render(component, wrapper);
        return this;
    }
    prependHtml(html) {
        this.element.insertAdjacentHTML('afterbegin', html);
        return this;
    }
    prependComponent(component) {
        this.element.insertAdjacentElement('afterbegin', createElement$1("<></>"));
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
function createElement$1(html, props = {}, target) {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        if ('className' in props)
            props.class = `bdd-wrapper ${props.className}`;
        else
            props.class = 'bdd-wrapper';
        html = `<div ${Object.entries(props).reduce((result, [key, value]) => {
            if (key === 'className')
                return result;
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

let events = [];
function addEventListener(element, type, listener, options) {
    element.addEventListener(type, listener, options);
    events.push({ element, type, listener });
}
function removeAllEventListeners() {
    for (const { element, type, listener } of events) {
        element.removeEventListener(type, listener);
    }
    events = [];
}

let injections = [];
function injectElement(parentSelectorResolve, element, type = 'beforeend') {
    $(parentSelectorResolve).element?.insertAdjacentElement(type, element);
    injections.push({ element });
}
function removeAllInjections() {
    injections.forEach(({ element }) => element.remove());
    injections = [];
}

const ChatFormSelector = "[class*=chatContent] form div:has(> [class*=textAreaSlate])";
const WPMCountId = 'wpm-count';

const debugLog = (...data) => getMeta().development ? log(...data) : undefined;

class DiumStore {
    constructor(defaults, dataKey, onLoad) {
        this.defaults = defaults;
        this.dataKey = dataKey;
        this.onLoad = onLoad;
        this.listeners = new Set();
        this.update = (item, replace = false) => {
            const current = replace ? {} : this.current;
            this.current = typeof item === "function"
                ? ({ ...current, ...item(this.current) })
                : ({ ...current, ...item });
            this._dispatch(true);
        };
        this.addReactChangeListener = this.addListener;
        this.removeReactChangeListener = this.removeListener;
    }
    load() {
        this.current = { ...this.defaults, ...load(this.dataKey) };
        this.onLoad?.();
        this._dispatch(false);
    }
    _dispatch(save$1) {
        for (const listener of this.listeners) {
            listener(this.current);
        }
        if (save$1) {
            save(this.dataKey, this.current);
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
const createDiumStore = (defaults, dataKey, onLoad) => new DiumStore(defaults, dataKey, onLoad);

function createProperty(options) {
    const optionsCompiled = typeof options === 'object' ? options : { defaultValue: options };
    const { defaultValue, beforeGet, beforeSet, afterSet } = optionsCompiled;
    let value = defaultValue;
    function get() {
        return beforeGet?.(value) ?? value;
    }
    function set(newValue) {
        value = beforeSet?.(newValue, false) ?? newValue;
        afterSet?.(value, false);
    }
    function nullableSet(newValue) {
        if (value === null || value === undefined)
            return set(newValue);
    }
    function reset() {
        value = defaultValue;
        afterSet?.(defaultValue, true);
    }
    function hasNoValue() {
        return value === null && value === undefined;
    }
    return { get, set, reset, nullableSet, hasNoValue };
}

const typingStartTime = createProperty(undefined);
const typingEndTime = createProperty(undefined);
const wpm = createProperty({
    defaultValue: 0,
    beforeSet: value => parseInt(value.toFixed(0)),
    afterSet: (value) => {
        const wpmCountElement = document.getElementById(WPMCountId);
        if (wpmCountElement)
            wpmCountElement.textContent = `${value} wpm`;
    }
});
function resetProperties() {
    typingStartTime.reset();
    typingEndTime.reset();
    wpm.reset();
}

const Settings = createSettings({
    leftAlign: '1ch'
}, function onLoad() {
    Highscores.load();
});
const Highscores = createDiumStore({
    best: 0,
    bestDate: new Date().toLocaleDateString(),
    today: 0,
    todayDate: new Date().toLocaleDateString()
}, 'highscores');

function calculateWPM(messageContent) {
    if (typingStartTime.hasNoValue() || typingEndTime.hasNoValue() || !messageContent)
        return;
    const timeDiffMs = typingEndTime.get() - typingStartTime.get();
    const timeDiffMin = timeDiffMs / 1000 / 60;
    const wordCount = messageContent.trim().split(/\s+/).length;
    if (wordCount <= 1 || messageContent.trim() === '')
        return;
    const value = wordCount / timeDiffMin;
    if (value > 300)
        return;
    wpm.set(value);
}
function updateHighscores() {
    const { best, bestDate, today: storedTodayScore, todayDate } = Highscores.current;
    const current = wpm.get();
    const today = new Date().toLocaleDateString() === new Date(todayDate).toLocaleDateString() ? storedTodayScore : 0;
    const notification = (current > best ? `New best highscore! ${current} wpm`
        : current > today ? `New today's highscore! ${current} wpm`
            : null);
    if (!notification)
        return;
    Highscores.update({
        best: Math.max(best, current),
        bestDate: current > best ? new Date().toLocaleDateString() : new Date(bestDate).toLocaleDateString(),
        today: Math.max(today, current),
        todayDate: new Date().toLocaleDateString()
    });
    log(notification, Highscores.current, { best, today, todayDate });
    BdApi.UI.showToast(notification);
}

function onKeyDown(event) {
    if (event.key.length !== 1)
        return;
    typingStartTime.nullableSet(Date.now());
}
function onKeyUp(event) {
    typingEndTime.set(Date.now());
    if (!(event.target instanceof HTMLElement))
        return;
    const messageContent = event.target.textContent;
    calculateWPM(messageContent);
    debugLog(`[${new Date(typingStartTime.get()).toLocaleTimeString()} - ${new Date(typingEndTime.get()).toLocaleTimeString()}] ${wpm}: ${messageContent}`);
    if ((event.key === 'Enter' || event.key === 'NumpadEnter') && !event.shiftKey) {
        onSubmit();
    }
    if (event.key === 'Backspace' && !messageContent.trim()) {
        debugLog('Reset', event);
        typingStartTime.reset();
        wpm.reset();
    }
}
function onSubmit() {
    typingStartTime.reset();
    updateHighscores();
}

const styles = "@charset \"UTF-8\";\n.words-per-minute-settings {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.words-per-minute-settings h3 {\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: var(--header-primary);\n  margin-bottom: 0.5rem;\n}\n.words-per-minute-settings input {\n  box-sizing: border-box;\n  width: 100%;\n  padding: 0.25rem;\n  border: 1px solid var(--interactive-normal);\n  border-radius: 0.5rem;\n  font-size: 1rem;\n  background-color: var(--background-modifier-accent);\n  color: var(--text-normal);\n}\n.words-per-minute-settings .words-per-minute-highscores {\n  margin-top: 1rem;\n}\n.words-per-minute-settings .words-per-minute-highscores section {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 1rem;\n  place-items: center;\n}\n.words-per-minute-settings .words-per-minute-highscores h3 {\n  font-size: 1.25rem;\n  font-weight: bold;\n  color: var(--header-primary);\n  margin-bottom: 0.5rem;\n  text-align: center;\n}\n.words-per-minute-settings .words-per-minute-highscores h3::after {\n  content: \"\";\n  display: block;\n  width: 100%;\n  height: 1px;\n  background-color: var(--background-modifier-accent);\n  margin-top: 0.5rem;\n}\n.words-per-minute-settings .words-per-minute-highscores h4 {\n  font-size: 1.2rem;\n  font-weight: bold;\n  color: var(--header-secondary);\n  margin-bottom: 0.5rem;\n}\n.words-per-minute-settings .words-per-minute-highscores p {\n  color: var(--text-normal);\n  font-size: 1rem;\n}\n.words-per-minute-settings .words-per-minute-highscores span:first-child {\n  font-weight: bold;\n}\n.words-per-minute-settings .words-per-minute-highscores span:last-child::before {\n  content: \" • \";\n}\n.words-per-minute-settings .words-per-minute-highscores button {\n  padding: 0.5rem;\n  font-size: 0.8rem;\n  border-radius: 0.5rem;\n  margin-inline: auto;\n  color: var(--button-danger-background) !important;\n}\n.words-per-minute-settings .words-per-minute-highscores button:hover {\n  color: var(--white-500) !important;\n}\n\n#wpm-count {\n  display: none;\n  transition: top 0.25s ease-in-out 1s;\n}\n\nform:not(:has(span[class*=emptyText])) #wpm-count {\n  --leftAlign: $defaultLeftAlign;\n  display: block;\n  color: var(--text-message-preview-low-sat);\n  font-size: 12px;\n  font-weight: bold;\n  position: absolute;\n  margin: 0;\n  top: 0.3rem;\n  left: var(--leftAlign, \"1.5rem\");\n}\n\nform:has(#wpm-count) {\n  position: relative;\n}\n\ndiv[class*=inner]:has([class*=textArea] [data-slate-string]:not(:empty)) {\n  padding-top: 1rem;\n}";

const { useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useId, useDeferredValue, useInsertionEffect, useSyncExternalStore, useTransition, createRef, createContext, createElement, createFactory, forwardRef, cloneElement, lazy, memo, isValidElement, Component, PureComponent, Fragment, Suspense, } = React;

const PluginName = getMeta().name;
const ResetButton = ({ children = 'Reset', onClick, danger }) => (React.createElement("button", { className: `bd-button bd-button-outlined ${danger ? 'bd-button-color-red' : 'bd-button-color-primary'}`, onClick: onClick }, children));
const SettingsGroup = ({ settingsKey, title, readonly }) => {
    const [current, defaults, set] = Settings.useStateWithDefaults();
    return (React.createElement("div", { className: `${PluginName}-${settingsKey}-setting` },
        React.createElement("h3", null, title),
        React.createElement("div", { className: "bd-flex bd-flex-horizontal", style: { gap: '.5rem' } },
            React.createElement("input", { type: typeof defaults[settingsKey] === 'number' ? 'number'
                    : typeof defaults[settingsKey] === 'boolean' ? 'checkbox'
                        : 'text', value: current[settingsKey], readOnly: readonly, onChange: event => {
                    set({ [settingsKey]: event.target.value });
                } }),
            React.createElement(ResetButton, { onClick: () => { set({ [settingsKey]: defaults[settingsKey] }); } }))));
};
const HighscoresGroup = ({ type }) => {
    const { best, bestDate, today, todayDate } = Highscores.useCurrent();
    const [value, date] = useMemo(() => type === 'best'
        ? [best, new Date(bestDate)]
        : [today, new Date(todayDate)], [type, best, bestDate, today, todayDate]);
    return (React.createElement("div", { className: `${PluginName}-${type}` },
        React.createElement("h3", null,
            type === 'best' ? 'Best' : `Today's`,
            " Highscore"),
        React.createElement("p", null,
            React.createElement("span", { id: `${PluginName}-${type}` },
                value,
                " wpm"),
            React.createElement("span", { id: `${PluginName}-${type}-date` }, date.toLocaleDateString()))));
};
function SettingsPanel() {
    const { todayDate } = Highscores.current;
    if (new Date(todayDate).toLocaleDateString() !== new Date().toLocaleDateString()) {
        Highscores.update({ today: 0, todayDate: new Date().toLocaleDateString() });
    }
    return (React.createElement("div", { className: `${PluginName}-settings`, style: { width: '100%' } },
        React.createElement(SettingsGroup, { settingsKey: "leftAlign", title: "Left Align" }),
        React.createElement("div", { className: `${PluginName}-highscores` },
            React.createElement("h3", null, "Highscores"),
            React.createElement("section", { className: `${PluginName}-highscores-container` },
                React.createElement(HighscoresGroup, { type: "best" }),
                React.createElement(HighscoresGroup, { type: "today" })),
            React.createElement(ResetButton, { danger: true, onClick: () => Highscores.reset() }, "Reset Highscores"))));
}

async function initChatForm(chatForm) {
    if (!chatForm)
        return;
    addEventListener(chatForm, 'keydown', onKeyDown);
    addEventListener(chatForm, 'keyup', onKeyUp);
    injectElement(chatForm, createElement$1(`<p id="${WPMCountId}" style="--leftAlign: ${Settings.current.leftAlign}">${wpm.get()} wpm</p>`));
}
async function checkChatFormMod(forceClear) {
    const wpmCount = document.getElementById(WPMCountId);
    if (wpmCount && forceClear)
        wpm.reset();
    if (wpmCount)
        return;
    const chatForm = document.querySelector(ChatFormSelector);
    if (chatForm)
        initChatForm(chatForm);
}
const index = createPlugin({
    start() {
        checkChatFormMod(true);
        this.interval = setInterval(checkChatFormMod, 1000);
    },
    stop() {
        resetProperties();
        removeAllEventListeners();
        removeAllInjections();
        clearInterval(this.interval);
    },
    Settings,
    styles,
    SettingsPanel
});

module.exports = index;

/*@end @*/
