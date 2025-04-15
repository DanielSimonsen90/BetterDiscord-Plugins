/**
 * @name UserBirthdays
 * @version 1.0.0
 * @author danhosaur
 * @authorLink https://github.com/danhosaur
 * @description Never forget your friends' birthdays! With this plugin, you can add their birthdays using your notes, view all the birthdays in the new calendar page, and even get a small 🎂 on a birthday person's avatar!
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/UserBirthdays
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
  "name": "user-birthdays",
  "version": "1.0.0",
  "author": "danhosaur",
  "description": "Never forget your friends' birthdays! With this plugin, you can add their birthdays using your notes, view all the birthdays in the new calendar page, and even get a small 🎂 on a birthday person's avatar!"
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

const join$1 = (...filters) => {
    return ((...args) => filters.every((filter) => filter(...args)));
};
const query$1 = ({ filter, name, keys, protos, source }) => join$1(...[
    ...[filter].flat(),
    typeof name === "string" ? byName$1(name) : null,
    keys instanceof Array ? byKeys$1(...keys) : null,
    protos instanceof Array ? byProtos$1(...protos) : null,
    source instanceof Array ? bySource$1(...source) : null
].filter(Boolean));
const checkObjectValues = (target) => target !== window && target instanceof Object && target.constructor?.prototype !== target;
const byEntry = (filter, every = false) => {
    return ((target, ...args) => {
        if (checkObjectValues(target)) {
            const values = Object.values(target);
            return values.length > 0 && values[every ? "every" : "some"]((value) => filter(value, ...args));
        }
        else {
            return false;
        }
    });
};
const byName$1 = (name) => {
    return (target) => (target?.displayName ?? target?.constructor?.displayName) === name;
};
const byKeys$1 = (...keys) => {
    return (target) => target instanceof Object && keys.every((key) => key in target);
};
const byProtos$1 = (...protos) => {
    return (target) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};
const bySource$1 = (...fragments) => {
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

const find$1 = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
    defaultExport: resolve,
    searchExports: entries
});
const query = (query, options) => find$1(query$1(query), options);
const byEntries = (...filters) => find$1(join$1(...filters.map((filter) => byEntry(filter))));
const byName = (name, options) => find$1(byName$1(name), options);
const byKeys = (keys, options) => find$1(byKeys$1(...keys), options);
const byProtos = (protos, options) => find$1(byProtos$1(...protos), options);
const bySource = (contents, options) => find$1(bySource$1(...contents), options);
const all = {
    find: (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
        first: false,
        defaultExport: resolve,
        searchExports: entries
    }) ?? [],
    query: (query, options) => all.find(query$1(query), options),
    byName: (name, options) => all.find(byName$1(name), options),
    byKeys: (keys, options) => all.find(byKeys$1(...keys), options),
    byProtos: (protos, options) => all.find(byProtos$1(...protos), options),
    bySource: (contents, options) => all.find(bySource$1(...contents), options)
};
const resolveKey = (target, filter) => [target, Object.entries(target ?? {}).find(([, value]) => filter(value))?.[0]];
const findWithKey = (filter) => resolveKey(find$1(byEntry(filter)), filter);
const demangle = (mapping, required, proxy = false) => {
    const req = required ?? Object.keys(mapping);
    const found = find$1((target) => (checkObjectValues(target)
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

const DiumFinder = {
    __proto__: null,
    abort,
    all,
    byEntries,
    byKeys,
    byName,
    byProtos,
    bySource,
    get controller () { return controller; },
    demangle,
    find: find$1,
    findWithKey,
    query,
    resolveKey,
    waitFor
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);
const warn = (...data) => print(console.warn, ...data);
const error = (...data) => print(console.error, ...data);
const group = (label, ...data) => print(console.group, label, ...data);
const groupCollapsed = (label, ...data) => print(console.groupCollapsed, label, ...data);
const groupEnd = () => console.groupEnd();

const diumLogger = {
    __proto__: null,
    error,
    group,
    groupCollapsed,
    groupEnd,
    log,
    print,
    warn
};

const patch$1 = (type, object, method, callback, options) => {
    const original = object?.[method];
    if (!(original instanceof Function)) {
        error(`Patch target ${original} is not a function`, object, method, options.name);
        BdApi.UI.alert("Error", `Patch target ${original} is not a function`);
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

const Dispatcher$1 = /* @__PURE__ */ byKeys(["dispatch", "subscribe"]);

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$1("Store", "connectStores"),
    Dispatcher: byProtos$1("dispatch"),
    Store: byProtos$1("emitChange"),
    BatchedStoreListener: byProtos$1("attach", "detach"),
    useStateFromStores: bySource$1("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);

const { React } = BdApi;
const { ReactDOM } = BdApi;
const classNames$1 = /* @__PURE__ */ find$1((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const EventEmitter = /* @__PURE__ */ find$1((exports) => exports.prototype instanceof Object && Object.prototype.hasOwnProperty.call(exports.prototype, "prependOnceListener"));

const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const Button$1 = /* @__PURE__ */ byKeys(["Colors", "Link"], { entries: true });

const Clickable = /* @__PURE__ */ bySource(["ignoreKeyPress:"], { entries: true });

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify", "Align"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText,
FormDivider, FormSwitch, FormNotice } = /* @__PURE__ */ demangle({
    FormSection: bySource$1("titleClassName:", ".sectionTitle"),
    FormItem: bySource$1("titleClassName:", "required:"),
    FormTitle: bySource$1("faded:", "required:"),
    FormText: (target) => target.Types?.INPUT_PLACEHOLDER,
    FormDivider: bySource$1(".divider", "style:"),
    FormSwitch: bySource$1("tooltipNote:"),
    FormNotice: bySource$1("imageData:", ".formNotice")
}, ["FormSection", "FormItem", "FormDivider"]);

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

const { Select, SingleSelect } =  demangle({
    Select: bySource$1("renderOptionLabel:", "renderOptionValue:", "popoutWidth:"),
    SingleSelect: bySource$1((source) => /{value:[a-zA-Z_$],onChange:[a-zA-Z_$]}/.test(source))
}, ["Select"]);

const { TextInput, InputError } = /* @__PURE__ */ demangle({
    TextInput: (target) => target?.defaultProps?.type === "text",
    InputError: bySource$1("error:", "text-danger")
}, ["TextInput"]);

const Text = /* @__PURE__ */ bySource(["lineClamp:", "variant:", "tabularNumbers:"], { entries: true });

const [getInstanceFromNode, getNodeFromInstance, getFiberCurrentPropsFromNode, enqueueStateRestore, restoreStateIfNeeded, batchedUpdates] = ReactDOM?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.Events ?? [];
const ReactDOMInternals = {
    getInstanceFromNode,
    getNodeFromInstance,
    getFiberCurrentPropsFromNode,
    enqueueStateRestore,
    restoreStateIfNeeded,
    batchedUpdates
};

const getFiber = (node) => ReactDOMInternals.getInstanceFromNode(node ?? {});
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
        React.createElement(FormDivider, { className: classNames$1(margins.marginTop20, margins.marginBottom20) }),
        React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
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

const { useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useId, useDeferredValue, useInsertionEffect, useSyncExternalStore, useTransition, createRef, createContext, createElement: createElement$1, createFactory, forwardRef, cloneElement, lazy, memo, isValidElement, Component, PureComponent, Fragment, Suspense, } = React;

function classNames(...classNames) {
    return classNames.filter(Boolean).join(' ');
}

function EphemeralEye(props) {
    const size = props.size || 16;
    const viewBox = 32;
    const className = classNames('ephemeral-eye', props.line && 'ephemeral-eye--line', props.className);
    return (React.createElement("svg", { ...props, className: className, "aria-hidden": false, width: size, height: size, viewBox: `0 0 ${viewBox} ${viewBox}`, style: { '--size': `${size}px` } },
        React.createElement("path", { fill: "currentColor", d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z" }),
        React.createElement("path", { fill: "currentColor", d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" }),
        props.line
            ? React.createElement("path", { fill: "currentColor", d: "M20.7071,20 L3,2 L2,3 L20,20 L20,20 Z" })
            : null));
}

class GlobalReq {
    static get instance() {
        if (!GlobalReq._instance) {
            const id = "WebModules_" + Math.floor(Math.random() * 1000000000000);
            let req;
            window.webpackChunkdiscord_app.push([[id], {}, r => { if (r.c)
                    req = r; }]);
            delete req.m[id];
            delete req.c[id];
            GlobalReq._instance = req;
        }
        return GlobalReq._instance;
    }
    constructor() { }
}
const Cache = {
    modules: {}
};
function BDFDB_findByStrings(strings, config = {}) {
    strings = strings.flat(10);
    return findModule("string", JSON.stringify(strings), m => checkModuleStrings(m, strings) && m, config);
}
function checkModuleStrings(module, strings, config = {}) {
    const check = (s1, s2) => {
        s1 = config.ignoreCase ? s1.toString().toLowerCase() : s1.toString();
        return config.hasNot ? s1.indexOf(s2) == -1 : s1.indexOf(s2) > -1;
    };
    return [strings].flat(10).filter(n => typeof n == "string").map(config.ignoreCase ? (n => n.toLowerCase()) : (n => n)).every(string => module && ((typeof module == "function" || typeof module == "string") && (check(module, string) || typeof module.__originalFunction == "function" && check(module.__originalFunction, string)) || typeof module.type == "function" && check(module.type, string) || (typeof module == "function" || typeof module == "object") && module.prototype && Object.keys(module.prototype).filter(n => n.indexOf("render") == 0).some(n => check(module.prototype[n], string))));
}
function findModule(type, cacheString, filter, config = {}) {
    if (!isObject(Cache.modules[type]))
        Cache.modules[type] = { module: {}, export: {} };
    let defaultExport = typeof config.defaultExport != "boolean" ? true : config.defaultExport;
    if (!config.all && defaultExport && Cache.modules[type].export[cacheString])
        return Cache.modules[type].export[cacheString];
    else if (!config.all && !defaultExport && Cache.modules[type].module[cacheString])
        return Cache.modules[type].module[cacheString];
    else {
        let m = find(filter, config);
        if (m) {
            if (!config.all) {
                if (defaultExport)
                    Cache.modules[type].export[cacheString] = m;
                else
                    Cache.modules[type].module[cacheString] = m;
            }
            return m;
        }
        else if (!config.noWarnings)
            warn(`${cacheString} [${type}] not found in WebModules`);
    }
}
function find(filter, config = {}) {
    let defaultExport = typeof config.defaultExport != "boolean" ? true : config.defaultExport;
    let onlySearchUnloaded = typeof config.onlySearchUnloaded != "boolean" ? false : config.onlySearchUnloaded;
    let all = typeof config.all != "boolean" ? false : config.all;
    const req = GlobalReq.instance;
    const found = [];
    if (!onlySearchUnloaded)
        for (let i in req.c)
            if (req.c.hasOwnProperty(i) && req.c[i].exports != window) {
                let m = req.c[i].exports, r = null;
                if (m && (typeof m == "object" || typeof m == "function")) {
                    if (!!(r = filter(m))) {
                        if (all)
                            found.push(defaultExport ? r : req.c[i]);
                        else
                            return defaultExport ? r : req.c[i];
                    }
                    else if (Object.keys(m).length < 400)
                        for (let key of Object.keys(m))
                            try {
                                if (m[key] && !!(r = filter(m[key]))) {
                                    if (all)
                                        found.push(defaultExport ? r : req.c[i]);
                                    else
                                        return defaultExport ? r : req.c[i];
                                }
                            }
                            catch (err) { }
                }
                if (config.moduleName && m && m[config.moduleName] && (typeof m[config.moduleName] == "object" || typeof m[config.moduleName] == "function")) {
                    if (!!(r = filter(m[config.moduleName]))) {
                        if (all)
                            found.push(defaultExport ? r : req.c[i]);
                        else
                            return defaultExport ? r : req.c[i];
                    }
                    else if (m[config.moduleName].type && (typeof m[config.moduleName].type == "object" || typeof m[config.moduleName].type == "function") && !!(r = filter(m[config.moduleName].type))) {
                        if (all)
                            found.push(defaultExport ? r : req.c[i]);
                        else
                            return defaultExport ? r : req.c[i];
                    }
                }
                if (m && m.__esModule && m.default && (typeof m.default == "object" || typeof m.default == "function")) {
                    if (!!(r = filter(m.default))) {
                        if (all)
                            found.push(defaultExport ? r : req.c[i]);
                        else
                            return defaultExport ? r : req.c[i];
                    }
                    else if (m.default.type && (typeof m.default.type == "object" || typeof m.default.type == "function") && !!(r = filter(m.default.type))) {
                        if (all)
                            found.push(defaultExport ? r : req.c[i]);
                        else
                            return defaultExport ? r : req.c[i];
                    }
                }
            }
    for (let i in req.m)
        if (req.m.hasOwnProperty(i)) {
            let m = req.m[i];
            if (m && typeof m == "function") {
                if (req.c[i] && !onlySearchUnloaded && filter(m)) {
                    if (all)
                        found.push(defaultExport ? req.c[i].exports : req.c[i]);
                    else
                        return defaultExport ? req.c[i].exports : req.c[i];
                }
                if (!req.c[i] && onlySearchUnloaded && filter(m)) {
                    const resolved = {}, resolved2 = {};
                    m(resolved, resolved2, req);
                    const trueResolved = resolved2 && Object.getOwnPropertyNames(resolved2).length == 0 ? resolved : resolved2;
                    if (all)
                        found.push(defaultExport ? trueResolved.exports : trueResolved);
                    else
                        return defaultExport ? trueResolved.exports : trueResolved;
                }
            }
        }
    if (all)
        return found;
}
function isObject(obj) {
    return obj && typeof obj === "object" && obj.constructor === Object;
}

const BDFDB_Finder = {
    __proto__: null,
    BDFDB_findByStrings
};

const debugLog = (...data) => getMeta().development ? log(...data) : undefined;
const debugWarn = (...data) => getMeta().development ? warn(...data) : undefined;
const Logger = {
    ...diumLogger,
    debugLog,
};

function findBySourceStrings(...keywords) {
    const searchOptions = keywords.find(k => typeof k === 'object');
    if (searchOptions)
        keywords.splice(keywords.indexOf(searchOptions), 1);
    const backupIdKeyword = keywords.find(k => k.toString().startsWith('backupId='));
    const backupId = backupIdKeyword ? backupIdKeyword.toString().split('=')[1] : null;
    const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
    if (backupIdKeywordIndex > -1)
        keywords.splice(backupIdKeywordIndex, 1);
    if (backupId)
        debugLog(`[findBySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);
    const showMultiple = keywords.find(k => k === 'showMultiple=true');
    const showMultipleIndex = keywords.indexOf(showMultiple);
    if (showMultipleIndex > -1)
        keywords.splice(showMultipleIndex, 1);
    if (showMultiple)
        debugLog(`[findBySourceStrings] Showing multiple results - [${keywords.join(',')}]`, keywords);
    const lazy = keywords.find(k => k === 'lazy=true');
    const lazyIndex = keywords.indexOf(lazy);
    if (lazyIndex > -1)
        keywords.splice(lazyIndex, 1);
    if (lazy)
        debugLog(`[findBySourceStrings] Using lazy search - [${keywords.join(',')}]`, keywords);
    const _keywords = keywords;
    const moduleCallback = (exports, _, id) => {
        if (!exports || exports === window)
            return false;
        const eIsFunctionAndHasKeywords = typeof exports === 'function'
            && _keywords.every(keyword => exports.toString().includes(keyword));
        if (eIsFunctionAndHasKeywords)
            return true;
        const eIsObject = Object.keys(exports).length > 0;
        const moduleIsMethodOrFunctionComponent = Object.keys(exports).some(k => typeof exports[k] === 'function'
            && _keywords.every(keyword => exports[k].toString().includes(keyword)));
        const eIsObjectAsE = _keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += exports[k]?.toString?.(), '').includes(keyword));
        const moduleIsObjectFromE = Object.keys(exports).some(k => exports[k] && typeof exports[k] === 'object'
            && _keywords.every(keyword => Object.keys(exports[k])
                .reduce((acc, key) => acc += exports[k][key]?.toString?.(), '')
                .includes(keyword)));
        const moduleIsClassComponent = Object.keys(exports).some(k => typeof exports[k] === 'function'
            && exports[k].prototype
            && 'render' in exports[k].prototype
            && _keywords.every(keyword => exports[k].prototype.render.toString().includes(keyword)));
        const moduleIsObjectOfObjects = Object.keys(exports).some(k => exports[k] && typeof exports[k] === 'object'
            && Object.keys(exports[k]).some(k2 => exports[k][k2] && typeof exports[k][k2] === 'object'
                && _keywords.every(keyword => Object.keys(exports[k][k2])
                    .reduce((acc, k3) => exports[k][k2] === window ? acc : acc += exports[k][k2][k3]?.toString?.(), '')
                    .includes(keyword))));
        const eIsClassAsE = typeof exports === 'object' && 'constructor' in exports && _keywords.every(keyword => exports.constructor.toString().includes(keyword));
        const eIsObjectWithKeywords = _keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += k + exports[k]?.toString?.(), '').includes(keyword));
        const filter = eIsObject ? (moduleIsMethodOrFunctionComponent
            || eIsObjectAsE
            || moduleIsClassComponent
            || moduleIsObjectFromE
            || moduleIsObjectOfObjects
            || eIsClassAsE
            || eIsObjectWithKeywords) : eIsFunctionAndHasKeywords;
        if ((filter && backupId && id.toString() !== backupId) || !filter && id.toString() === backupId)
            debugWarn(`[findBySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`, {
                exports,
                internal: {
                    eIsFunctionAndHasKeywords,
                    moduleIsMethodOrFunctionComponent,
                    eIsObjectAsE,
                    moduleIsClassComponent,
                    moduleIsObjectFromE,
                    moduleIsObjectOfObjects,
                    eIsClassAsE,
                },
                strings: {
                    exports: JSON.stringify(exports),
                    keys: Object.keys(exports).map(k => `${k}: ${JSON.stringify(exports[k])}`),
                }
            });
        if (backupId && backupId === id.toString())
            debugLog('Found by id', { exports, id });
        return filter;
    };
    const moduleCallbackBoundary = (exports, _, id) => {
        try {
            return moduleCallback(exports, _, id.toString());
        }
        catch (err) {
            const expectedErrorMessages = [
                `TypedArray`,
                `from 'Window'`,
                `Cannot convert a Symbol value to a string`,
                '$$baseObject',
            ];
            if (err instanceof Error && expectedErrorMessages.some(message => err.message.includes(message)))
                return undefined;
            error(`[findBySourceStrings] Error in moduleCallback`, err);
        }
    };
    const moduleSearchOptions = searchOptions ?? { searchExports: true };
    const module = showMultiple
        ? BdApi.Webpack.getModules(moduleCallbackBoundary, moduleSearchOptions)
        : BdApi.Webpack.getModule(moduleCallbackBoundary, moduleSearchOptions);
    if (module)
        return lazy ? Promise.resolve(module) : module;
    if (lazy)
        return BdApi.Webpack.waitForModule(moduleCallbackBoundary, {
            signal: controller.signal,
            ...searchOptions
        }).then(module => {
            debugLog(`[findBySourceStrings] Found lazy module for [${keywords.join(',')}]`, module);
            return module;
        }).catch(err => {
            error(`[findBySourceStrings] Error in lazy search`, err);
            return undefined;
        });
}
const findComponentBySourceStrings = async (...keywords) => {
    const jsxModule = Finder.byKeys(['jsx']);
    const ReactModule = Finder.byKeys(['createElement', 'cloneElement']);
    keywords = keywords.map(keyword => keyword.replace(/\s+/g, ''));
    const component = await new Promise((resolve, reject) => {
        try {
            const cancelJsx = after(jsxModule, 'jsx', ({ args: [component] }) => {
                if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
                    cancelJsx();
                    cancelCE();
                    resolve(component);
                }
            }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`, });
            const cancelCE = after(ReactModule, 'createElement', ({ args: [component] }) => {
                if (typeof component === 'function' && keywords.every(keyword => component.toString().includes(keyword))) {
                    cancelJsx();
                    cancelCE();
                    resolve(component);
                }
            }, { name: `findComponentBySourceStrings([${keywords.join(',')}])`, });
        }
        catch (err) {
            reject(err);
        }
    });
    if (typeof component !== 'object')
        return component;
    if ('prototype' in component
        && typeof component.prototype === 'object'
        && 'render' in component.prototype
        && typeof component.prototype.render === 'function') {
        component.prototype.render = component.prototype.render.bind(component);
        return component;
    }
    return component;
};
const findModuleById = (id, options) => {
    return BdApi.Webpack.getModule((_, __, _id) => _id === id.toString(), options);
};
function findUnpatchedModuleBySourceStrings(...keywords) {
    const module = findBySourceStrings(...keywords);
    if (!module) {
        log(`[findUnpatchedModuleBySourceStrings] Module not found for keywords: [${keywords.join(',')}]`);
        return undefined;
    }
    if (typeof module === 'function')
        return module['__originalFunction'];
    return module;
}
const Finder = {
    ...DiumFinder,
    ...BDFDB_Finder,
    findBySourceStrings,
    findComponentBySourceStrings,
    findModuleById,
    findUnpatchedModuleBySourceStrings,
};

const QuickSwitcherStore = byName("QuickSwitcherStore");

const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const MessageStore = byName("MessageStore");

const PresenceStore = /* @__PURE__ */ byName("PresenceStore");

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

const UserStore = Finder.byName("UserStore");

const UserTypingStore = byKeys(["getTypingUsers", "isTyping"]);

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
        if (!dataKey.endsWith('Store'))
            this.dataKey = formatStoreName(dataKey);
        this.current = { ...defaults };
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
function formatStoreName(name) {
    const pascal = name.charAt(0).toUpperCase() + name.slice(1);
    return name.endsWith('Store')
        ? pascal
        : `${pascal}Store`;
}

(() => (Array.from(BdApi.Webpack
    .getModules(m => m?._dispatchToken && m?.getName)
    .reduce((acc, store) => {
    const storeName = store.constructor.displayName
        ?? store.constructor.persistKey
        ?? store.constructor.name
        ?? store.getName();
    if (storeName.length !== 1)
        acc.set(storeName, store);
    return acc;
}, new Map())).sort(([aStoreName], [bStoreName]) => aStoreName.localeCompare(bStoreName))
    .reduce((acc, [storeName, store]) => {
    acc[storeName] = store;
    return acc;
}, {})))();
const DanhoStores = new class DanhoStores {
    register(store) {
        this[store.dataKey] = store;
        if (window.DL?.Stores.DanhoStores) {
            const instance = window.DL.Stores.DanhoStores;
            if (store.dataKey in instance)
                return;
            instance.register(store);
        }
    }
};

function buildContextMenu(...items) {
    return BdApi.ContextMenu.buildMenu(items);
}
function buildTextItem(id, label, action, props = {}) {
    return {
        type: 'text',
        label,
        action,
        id,
        onClose: props.onClose ?? (() => { }),
        ...props
    };
}

function getGroupContaining(itemId, menu) {
    const findItem = (menu) => {
        if (!menu.props || !menu.props.children)
            return null;
        else if (!Array.isArray(menu.props.children))
            return findItem(menu.props.children);
        for (const child of menu.props.children.filter(child => child?.props)) {
            if ('id' in child.props && child.props.id === itemId) {
                return menu.props.children;
            }
            else if ('key' in child && child.key === itemId) {
                return menu.props.children;
            }
            const found = findItem(child);
            if (found)
                return found;
        }
        return null;
    };
    return findItem(menu);
}
function openContextMenu(items, config) {
    return (e) => BdApi.ContextMenu.open(e, buildContextMenu(...items), config);
}
const ContextMenuUtils = {
    getGroupContaining,
    openContextMenu,
};

function exclude(from, ...properties) {
    if (!from)
        return from;
    return Object.keys(from).reduce((acc, key) => {
        if (!properties.includes(key))
            acc[key] = from[key];
        return acc;
    }, {});
}
function combine(...objects) {
    return objects.reduce((acc, obj) => {
        if (!obj)
            return acc;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                acc[key] = combine(acc[key], obj[key]);
            }
            else if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                acc[key] = obj[key];
            }
        }
        return acc;
    }, {});
}

const indexDuplicate = (key, index) => `${key}--${index}`;
function combineModuleByKeys(...modules) {
    return modules.reduce((combined, sourceStrings) => {
        const module = Finder.byKeys(sourceStrings);
        return combineModules(combined, module);
    }, {});
}
function combineModules(...modules) {
    const record = modules.reduce((combined, module, index) => {
        if (!module) {
            warn(`[ObjectUtils.combineModules] Module not found for index: ${index}`, modules);
            return combined;
        }
        for (const key in module) {
            let prop = key;
            if (key in combined) {
                const duplicateIndex = Object.keys(combined).filter(k => k.startsWith(`${key}--`)).length;
                prop = indexDuplicate(key, duplicateIndex);
            }
            const element = module[key];
            if (typeof element === 'object' && !Array.isArray(element)) {
                combined[prop] = combine(combined[prop], element);
            }
            else if (element !== undefined && element !== null && element !== '') {
                combined[prop] = element;
            }
        }
        return combined;
    }, {});
    const combined = Object.assign({
        getDuplicateKeys: function () {
            return Object.keys(this).filter(key => key.includes('--')).map(key => key.split('--')[0]);
        },
        containsClassName: function (className) {
            return containsClassInModule(className, this);
        },
        getClassNameKey: function (className) {
            return Object.entries(this).find(([key, value]) => value === className)?.[0];
        }
    }, record);
    return combined;
}
function containsClassInModule(className, module) {
    return Object.values(module).some((value) => value === className);
}
function findModuleWithMinimalKeys(className) {
    const module = Finder.findBySourceStrings(className, { defaultExport: false });
    if (!module) {
        warn(`Module not found for className: ${className}`);
        return null;
    }
    const keys = Object.keys(module);
    if (keys.length === 0) {
        warn(`No keys found in the module for className: ${className}`);
        return null;
    }
    const classNameKey = Object.keys(module).find(key => module[key] === className);
    const byClassNameKey = Finder.byKeys([classNameKey]);
    if (byClassNameKey === module)
        return { module, keys: [classNameKey] };
    let minimalKeys = [...keys];
    for (const key of keys) {
        const testKeys = minimalKeys.filter(k => k !== key);
        const foundModule = Finder.byKeys(testKeys);
        if (foundModule === module) {
            minimalKeys = testKeys;
        }
    }
    return { module, keys: minimalKeys };
}
const ColorClassNames = Finder.byKeys(["colorDefault", "radioIcon"]);
const ClassNamesUtils = {
    combineModuleByKeys,
    combineModules,
    containsClassInModule,
    indexDuplicate,
    findModuleWithMinimalKeys,
    ColorClassNames,
};

const RatelimitProtector = new class RatelimitProtector {
    constructor() {
        this._promise = null;
    }
    async execute(call) {
        if (this._promise) {
            return await this._promise;
        }
        this._promise = call();
        const result = await this._promise;
        this._promise = null;
        return result;
    }
};
const DiscordRequesterModule = Finder.findBySourceStrings("API_ENDPOINT", "API_VERSION", { defaultExport: false });
const DiscordRequester = DiscordRequesterModule.tn;
const NetUtils = {
    DiscordRequester,
    RatelimitProtector,
};

function join(args, separator = ',', includeAnd = true) {
    const validArgs = args?.filter(arg => arg !== undefined && arg !== null && arg !== '');
    if (!validArgs || validArgs.length === 0)
        return '';
    if (validArgs.length === 1)
        return validArgs.shift();
    const lastArg = validArgs.pop();
    const combinedArgs = validArgs.join(separator);
    return `${combinedArgs}${includeAnd ? ' & ' : ''}${lastArg}`;
}
function kebabCaseFromCamelCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function kebabCaseFromPascalCase(str) {
    return kebabCaseFromCamelCase(str.charAt(0).toLowerCase() + str.slice(1));
}
function pascalCaseFromSnakeCase(str) {
    const replaced = str.replace(/_./g, match => ` ${match.charAt(1).toUpperCase()}`);
    return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}
function pascalCaseFromCamelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}
function generateRandomId() {
    return Math.random().toString(36).substring(2, 9);
}
function formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const withZero = (num) => String(num).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', withZero(month))
        .replace('DD', withZero(day));
}
const StringUtils = {
    join, formatDate,
    kebabCaseFromCamelCase, kebabCaseFromPascalCase,
    pascalCaseFromSnakeCase, pascalCaseFromCamelCase,
    generateRandomId,
};

const InternalDiscordEndpoints = Finder.findBySourceStrings("ACCOUNT_NOTIFICATION_SETTINGS", "BADGE_ICON");
const DiscordEndpoints = Object.assign({}, InternalDiscordEndpoints, {
    BADGE_ICON: (icon) => `${location.protocol}//${window.GLOBAL_ENV.CDN_HOST}${InternalDiscordEndpoints.BADGE_ICON(icon)}`,
});
const UrlUtils = {
    DiscordEndpoints,
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;
function timeSpan(startTime, endTime, format = 'full') {
    const min = Math.min(startTime, endTime);
    const max = Math.max(startTime, endTime);
    const time = max - min;
    const seconds = Math.floor(time / SECOND);
    const minutes = Math.floor(time / MINUTE);
    const hours = Math.floor(time / HOUR);
    const days = Math.floor(time / DAY);
    const weeks = Math.floor(time / WEEK);
    const months = Math.floor(time / MONTH);
    const years = Math.floor(time / YEAR);
    const stringify = (value, unit) => `${format === 'full' ? value : value.toString().padStart(2, '0')}${unit}${value === 1 || format !== 'full' ? '' : 's'}`;
    const toString = () => [
        years ? stringify(years, format === 'full' ? ' year' : format === 'short' ? 'y' : '') : null,
        months ? stringify(months % 12, format === 'full' ? ' month' : format === 'short' ? 'M' : '') : null,
        weeks ? stringify(weeks % 4, format === 'full' ? ' week' : format === 'short' ? 'w' : '') : null,
        days ? stringify(days % 7, format === 'full' ? ' day' : format === 'short' ? 'd' : '') : null,
        hours ? stringify(hours % 24, format === 'full' ? ' hour' : format === 'short' ? 'h' : '') : null,
        minutes ? stringify(minutes % 60, format === 'full' ? ' minute' : format === 'short' ? 'm' : '') : null,
        seconds ? stringify(seconds % 60, format === 'full' ? ' second' : format === 'short' ? 's' : '') : null,
    ].filter(Boolean).join(format === 'full' ? ', ' : format === 'short' ? ' ' : ':');
    return {
        toString, stringify,
        years,
        months: months,
        weeks: weeks,
        days, hours, minutes, seconds,
        time, min, max,
    };
}
function wait(callbackOrTime, time) {
    const callback = typeof callbackOrTime === 'function' ? callbackOrTime : (() => undefined);
    time ??= callbackOrTime;
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(callback()), time);
        }
        catch (err) {
            reject(err);
        }
    });
}
function getUnixTime(arg) {
    const timestamp = typeof arg === 'number' ? arg : new Date(arg).getTime();
    return Math.floor(timestamp / 1000);
}
function throttle(callback, delay) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            callback(...args);
        }
    };
}
const TimeUtils = {
    SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR,
    timeSpan, getUnixTime, wait,
    throttle,
};

const ActionsEmitter = new class ActionsEmitter extends EventEmitter {
    constructor() {
        super(...arguments);
        this._events = new Map();
    }
    on(eventName, listener) {
        const callback = (...args) => {
            try {
                listener(...args);
            }
            catch (error) {
                console.error(error, { eventName, args });
            }
        };
        const existing = this._events.get(eventName) ?? [];
        this._events.set(eventName, [...existing, [listener, callback]]);
        Dispatcher$1.subscribe(eventName, callback);
        Logger.log(`[ActionsEmitter] Subscribed to ${eventName}`);
        return super.on(eventName, callback);
    }
    ;
    once(eventName, listener) {
        const callback = (...args) => {
            try {
                listener(...args);
            }
            catch (error) {
                console.error(error, { eventName, args });
            }
        };
        const existing = this._events.get(eventName) ?? [];
        this._events.set(eventName, [...existing, [listener, callback]]);
        Dispatcher$1.subscribe(eventName, (...args) => {
            callback(...args);
            Dispatcher$1.unsubscribe(eventName, callback);
            this._events.set(eventName, this._events.get(eventName).filter(([l]) => l !== listener));
        });
        Logger.log(`[ActionsEmitter] Subscribed to ${eventName}`);
        return super.once(eventName, callback);
    }
    off(eventName, listener) {
        Dispatcher$1.unsubscribe(eventName, listener);
        const existing = this._events.get(eventName) ?? [];
        this._events.set(eventName, existing.filter(([l]) => l !== listener));
        Logger.log(`[ActionsEmitter] Unsubscribed from ${eventName}`);
        return super.off(eventName, listener);
    }
    removeAllListeners(event) {
        this._events.forEach((listeners, event) => {
            listeners.forEach(([listener, wrapped]) => Dispatcher$1.unsubscribe(event, wrapped));
        });
        this._events.clear();
        Logger.log(`[ActionsEmitter] Unsubscribed from all events`);
        return super.removeAllListeners(event);
    }
    emit(eventName, ...args) {
        Logger.log(`[ActionsEmitter] Emitting ${eventName}`, { args });
        const actionProps = args.shift();
        if (args.length)
            Logger.warn(`The following arguments were not used:`, { args });
        const payload = Object.assign({ type: eventName }, actionProps);
        Logger.log(`[ActionsEmitter] Dispatching ${eventName}`, { payload });
        Dispatcher$1.dispatch(payload);
        this._events.get(eventName)?.forEach(([_, wrapped]) => wrapped(...args));
        return super.emit(eventName, ...args);
    }
};

const UserNoteActions = {
    updateNote: (userId, note) => updateNote(userId, note),
    getNote: (userId) => UserNoteStore.getNote(userId),
    getOrRequestNote: (userId, waitTimeout = 2000) => new Promise(async (resolve, reject) => {
        const noteResult = UserNoteStore.getNote(userId);
        if (noteResult?.note)
            resolve(noteResult.note);
        ActionsEmitter.once('USER_NOTE_LOADED', (data) => resolve(data?.note?.note));
        requestNote(userId);
        TimeUtils.wait(reject, waitTimeout);
    })
};
async function requestNote(userId) {
    ActionsEmitter.emit('USER_NOTE_LOAD_START', { userId });
    try {
        const { body } = await NetUtils.DiscordRequester.get({
            url: UrlUtils.DiscordEndpoints.NOTE(userId),
            oldFormErrors: true,
            rejectWithError: true,
        });
        ActionsEmitter.emit('USER_NOTE_LOADED', { note: body, userId });
    }
    catch {
        ActionsEmitter.emit('USER_NOTE_LOADED', { userId });
    }
}
async function updateNote(userId, note) {
    const InternalUserNoteActions = await new Promise((resolve, reject) => {
        Finder.findBySourceStrings(".NOTE(", "note:", 'lazy=true')
            .then(resolve)
            .catch(reject);
        wait(2000).then(reject);
    });
    if (InternalUserNoteActions?.updateNote)
        return InternalUserNoteActions.updateNote(userId, note);
    return NetUtils.DiscordRequester.put({
        url: UrlUtils.DiscordEndpoints.NOTE(userId),
        body: { note },
        oldFormErrors: false,
        rejectWithError: false,
    });
}

const navigate = Finder.findBySourceStrings("transitionTo -", { defaultExport: false, searchExports: true });
const navigateToGuild = Finder.findBySourceStrings("transitionToGuild -", { defaultExport: false, searchExports: true });
const AppActions = {
    navigate,
    navigateToGuild,
};

const UserUtils = {
    ...UserStore,
    ...PresenceStore,
    ...RelationshipStore,
    ...UserActivityStore,
    ...UserNoteStore,
    ...UserTypingStore,
    ...UserMentionStore,
    ...UserNoteActions,
    get me() {
        const user = UserStore.getCurrentUser();
        return Object.assign(user, {
            getAvatarURL: user.getAvatarURL.bind(user),
        }, {
            get status() {
                return PresenceStore.getStatus(user.id);
            }
        });
    },
    getPresenceState: () => PresenceStore.getState(),
    getCurrentUser: () => UserStore.getCurrentUser(),
    getUserByUsername(username) {
        return Object.values(UserStore.getUsers()).find(user => user.username === username);
    },
    getUsersPrioritizingFriends(byName) {
        const getUsername = (user) => this.getUsernames(user, true).shift();
        const sort = (a, b) => getUsername(a).localeCompare(getUsername(b));
        const friends = RelationshipStore
            .getFriendIDs()
            .map(UserStore.getUser)
            .sort(sort);
        const users = Object
            .values(UserStore.getUsers())
            .sort(sort);
        const result = [...friends, ...users].filter((user, index, self) => (index === self.findIndex(u => u.id === user.id)));
        return byName
            ? result.filter(user => getUsername(user).includes(byName.toLowerCase()))
            : result;
    },
    openModal(userId, showGuildProfile = false) {
        const currentGuildId = SelectedGuildStore.getGuildId();
        const currentChannelId = SelectedChannelStore.getChannelId();
        ActionsEmitter.emit('USER_PROFILE_MODAL_OPEN', {
            userId,
            channelId: currentChannelId,
            guildId: currentGuildId,
            messageId: MessageStore.getLastMessage(currentChannelId)?.id,
            sessionId: undefined,
            showGuildProfile,
            sourceAnalyticsLocations: [
                "username",
                "bite size profile popout",
                "avatar"
            ]
        });
    },
    getUsernames(user, lowered = false) {
        return [
            user.globalName,
            user.username,
            user.tag
        ]
            .filter(Boolean)
            .map(name => lowered ? name.toLowerCase() : name);
    },
    getDisplayName(user) {
        return this.getUsernames(user).shift();
    },
};

const AvatarWithText = Finder.findBySourceStrings("AvatarWithText");
const AvatarWithTextClassNameModule = ClassNamesUtils.combineModuleByKeys(["avatarWithText"]);

var ButtonLooks;
(function (ButtonLooks) {
    ButtonLooks[ButtonLooks["BLANK"] = 0] = "BLANK";
    ButtonLooks[ButtonLooks["FILLED"] = 1] = "FILLED";
    ButtonLooks[ButtonLooks["LINK"] = 2] = "LINK";
    ButtonLooks[ButtonLooks["OUTLINED"] = 3] = "OUTLINED";
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
})(ButtonSizes || (ButtonSizes = {}));
var Colors$1;
(function (Colors) {
    Colors[Colors["BRAND"] = 0] = "BRAND";
    Colors[Colors["BRAND_INVERTED"] = 1] = "BRAND_INVERTED";
    Colors[Colors["CUSTOM"] = 2] = "CUSTOM";
    Colors[Colors["GREEN"] = 3] = "GREEN";
    Colors[Colors["LINK"] = 4] = "LINK";
    Colors[Colors["PRIMARY"] = 5] = "PRIMARY";
    Colors[Colors["RED"] = 6] = "RED";
    Colors[Colors["TRANSPARENT"] = 7] = "TRANSPARENT";
    Colors[Colors["WHITE"] = 8] = "WHITE";
})(Colors$1 || (Colors$1 = {}));
const Button = Finder.findBySourceStrings("FILLED", "BRAND", "MEDIUM", "button", "buttonRef");

const GlobalNavigation = Finder.findBySourceStrings("ConnectedPrivateChannelsList", { defualtExport: false });

const ScrollerLooks = Finder.byKeys(['thin', 'fade']);
const ScrollerWrapper = Finder.findBySourceStrings("paddingFix", "getScrollerState");
const ScrollerAuto = ScrollerWrapper();

const getNode = Finder.findBySourceStrings("timestamp", "format", "parsed", "full", { searchExports: true });
const Timestamp = Finder.findBySourceStrings(".timestampTooltip", { defaultExport: false, }).Z;
function TimestampComponent({ unix, format }) {
    if (isNaN(unix)) {
        Logger.error("TimestampComponent: Invalid unix timestamp", { unix, format });
        return null;
    }
    const node = getNode(unix, format);
    const BadTimestamp = React.createElement("p", null, new Date(unix * 1000).toLocaleString());
    try {
        return typeof Timestamp === 'function' ? React.createElement(Timestamp, { node: node }) : BadTimestamp;
    }
    catch (e) {
        console.error(e);
        return BadTimestamp;
    }
}

var Colors;
(function (Colors) {
    Colors[Colors["BLACK"] = 0] = "BLACK";
    Colors[Colors["BRAND"] = 1] = "BRAND";
    Colors[Colors["CUSTOM"] = 2] = "CUSTOM";
    Colors[Colors["GREEN"] = 3] = "GREEN";
    Colors[Colors["GREY"] = 4] = "GREY";
    Colors[Colors["PRIMARY"] = 5] = "PRIMARY";
    Colors[Colors["RED"] = 6] = "RED";
    Colors[Colors["YELLOW"] = 7] = "YELLOW";
})(Colors || (Colors = {}));
var Positions;
(function (Positions) {
    Positions[Positions["BOTTOM"] = 0] = "BOTTOM";
    Positions[Positions["CENTER"] = 1] = "CENTER";
    Positions[Positions["LEFT"] = 2] = "LEFT";
    Positions[Positions["RIGHT"] = 3] = "RIGHT";
    Positions[Positions["WINDOW_CENTER"] = 4] = "WINDOW_CENTER";
})(Positions || (Positions = {}));
const TooltipModule = BdApi.Components.Tooltip;
const Tooltip = TooltipModule;

const DanhoBirthdayCalendarKey = "danho-birthday-calendar";
const CALENDAR_PAGE_CLASSNAME = 'calendar-page';
const BIRTHDAY_REGEX = /\d{1,2}\/\d{1,2}(\/(\d{4}|\d{2}))?/;
function getBirthdate(birthdate) {
    if (!BIRTHDAY_REGEX.test(birthdate))
        return new Date(birthdate);
    const now = new Date();
    const [day, month, year] = birthdate
        .split('/')
        .map((value, index) => Number(value) + (value.length === 2 && index === 2
        ? now.getFullYear() - 2000 > Number(value) ? 2000 : 1900
        : 0));
    return new Date(year || now.getFullYear(), month - 1, day);
}

const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};
const getShiftedDay = (day) => (day === 0 ? 6 : day - 1);
function MonthDays({ currentDate, children, onDateClick }) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getShiftedDay(new Date(year, month, 1).getDay());
    const days = new Array();
    for (let i = 0; i < firstDay; i++) {
        days.push(React.createElement("div", { key: `empty-${i}`, className: 'danho-calendar__day--empty' }));
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = StringUtils.formatDate(date, 'YYYY-MM-DD');
        const isToday = new Date().toDateString() === date.toDateString();
        const child = children(dateString, date);
        days.push(React.createElement("div", { key: day, className: classNames('danho-calendar__day', isToday && 'danho-calendar__day--today'), onClick: () => onDateClick?.(dateString, date) },
            React.createElement(Text, { variant: 'heading-md/bold', className: 'danho-calendar__day-number' }, day),
            React.createElement(ScrollerAuto, { className: classNames(ScrollerLooks.thin, 'danho-calendar__day-content') }, child)));
    }
    return React.createElement(React.Fragment, null, days);
}

function Calendar({ children, onDateClick, ...props }) {
    const [currentDate, setCurrentDate] = useState(props.startDate || new Date());
    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(prevMonth);
        if (props.onDateChange)
            props.onDateChange(prevMonth);
    };
    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(nextMonth);
        if (props.onDateChange)
            props.onDateChange(nextMonth);
    };
    return (React.createElement("div", { className: 'danho-calendar' },
        React.createElement(ScrollerAuto, { className: ScrollerLooks.thin },
            React.createElement("div", { className: 'danho-calendar__header' },
                React.createElement(Button, { look: Button.Looks.FILLED, onClick: handlePrevMonth }, "Previous"),
                React.createElement(Text, { variant: 'heading-xl/bold' },
                    currentDate.toLocaleString('default', { month: 'long' }),
                    " ",
                    currentDate.getFullYear()),
                React.createElement(Button, { look: Button.Looks.FILLED, onClick: handleNextMonth }, "Next")),
            React.createElement("div", { className: "danho-calendar__content" },
                React.createElement("div", { className: 'danho-calendar__day-names' }, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (React.createElement(Text, { key: day, variant: 'heading-lg/bold', className: 'danho-calendar__day-name' }, day)))),
                React.createElement("div", { className: 'danho-calendar__month-days' },
                    React.createElement(MonthDays, { currentDate, children, onDateClick }))))));
}

const AppClassNames = ClassNamesUtils.combineModuleByKeys(['app', 'mobileApp']);
function useClickOutside(arg, callback) {
    const clickId = StringUtils.generateRandomId();
    callback = callback || arg;
    const onClickOutside = (event) => {
        const selectedNode = (typeof arg === 'string' ? document.querySelector(arg)
            : 'current' in arg ? arg.current
                : document.querySelector(`[data-click-id="${clickId}"]`));
        const target = event.target;
        const [appContainer] = document.getElementsByClassName(AppClassNames.app);
        if (selectedNode && appContainer.contains(target) && !selectedNode.contains(target))
            callback(event);
    };
    useEffect(() => {
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('touchstart', onClickOutside);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('touchstart', onClickOutside);
        };
    }, [arg, callback]);
    return clickId;
}

function useKeybind() {
    const ref = Array.isArray(arguments[0]) ? { current: window } : arguments[0];
    const kebyinds = Array.isArray(arguments[0]) ? arguments[0] : arguments[1];
    const onKeybind = Array.isArray(arguments[0]) ? arguments[1] : arguments[2];
    const [isCtrl, isShift, isAlt] = ['Control', 'Shift', 'Alt'].map(k => kebyinds.includes(k));
    const _keybinds = kebyinds.filter(k => !['Control', 'Shift', 'Alt'].includes(k));
    useEffect(() => {
        const onKeyDown = (e) => {
            if (isCtrl && !e.ctrlKey)
                return;
            if (isShift && !e.shiftKey)
                return;
            if (isAlt && !e.altKey)
                return;
            if (!_keybinds.includes(e.key))
                return;
            onKeybind(e);
        };
        const target = ref?.current;
        if (!target)
            return;
        target.addEventListener('keydown', onKeyDown);
        return () => target.removeEventListener('keydown', onKeyDown);
    }, [ref, kebyinds, onKeybind]);
}

function useDebounceCallback(callback, delay) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    return useRef((...args) => {
        const handler = setTimeout(() => callbackRef.current(...args), delay);
        return () => clearTimeout(handler);
    }).current;
}

const InputModule = ClassNamesUtils.combineModuleByKeys(['inputWrapper', 'inputDefault'], ['dividerDefault', 'title']);
function FormItemFromModel(props) {
    const { model, property } = props;
    const onModelChange = 'onModelChange' in props ? props.onModelChange : (m, p, v) => { };
    const onChange = 'onChange' in props ? props.onChange : (v) => { };
    const { label, value } = props;
    return React.createElement(FormGroup, { ...props, name: property, label: label ?? StringUtils.pascalCaseFromCamelCase(property), inputType: props.type ?? getInputType(value ?? model[property]), value: value ?? model[property], onChange: (v) => {
            onModelChange(Object.assign({}, model, { [property]: v }), property, v);
            onChange(v);
        } });
}
function FormGroup(props) {
    const [internal, setInternal] = useState(props.value);
    const [inputType, setInputType] = useState(props.inputType);
    const debounceChange = useDebounceCallback((value) => props.onChange(value), props.debounce);
    const onChange = useCallback((newValue) => {
        setInternal(newValue);
        if (props.debounce)
            debounceChange(newValue);
        else
            props.onChange(newValue);
    }, [props.debounce, props.onChange, props.inputType, props.value]);
    const className = classNames("danho-form-group__input", `danho-form-group__${props.inputType}`, props.required && `danho-form-group__${props.inputType}--required`, props.disabled && InputModule.disabled, InputModule.inputDefault);
    const toggleInputType = (ref) => () => {
        if (ref && 'current' in ref && ref.current) {
            const cursorPosition = ref.current.selectionStart;
            setInputType(current => current === 'text' ? 'password' : 'text');
            setTimeout(() => {
                if (ref.current && cursorPosition !== null) {
                    ref.current.setSelectionRange(cursorPosition, cursorPosition);
                }
            }, 0);
        }
    };
    return (React.createElement(EmptyFormGroup, { label: props.label, name: props.name, onClick: () => {
            if (props.inputType === 'checkbox')
                return;
        } }, ref => (React.createElement(React.Fragment, null,
        props.inputType === 'checkbox' ? (React.createElement(FormSwitch, { className: className, value: typeof internal === 'boolean' ? internal : undefined, disabled: props.disabled, onChange: checked => onChange(checked) })) : (React.createElement("div", { className: "input-container" },
            React.createElement("input", { className: className, ref: ref, type: inputType, placeholder: props.inputType === 'checkbox' ? undefined : props.label, name: props.name, required: props.required, disabled: props.disabled, defaultValue: props.defaultValue, checked: typeof internal === 'boolean' ? internal : undefined, value: typeof internal === 'boolean' ? undefined : internal, min: props.inputType === 'number' ? props.min : undefined, max: props.inputType === 'number' ? props.max : undefined, onChange: e => {
                    const newValue = props.inputType === 'checkbox'
                        ? e.currentTarget.checked
                        : typeof props.value === 'number' ? Number(e.target.value) : e.currentTarget.value;
                    onChange(newValue);
                } }),
            props.inputType === 'password' && (React.createElement(EphemeralEye, { size: props.ephemeralEyeSize, line: inputType !== 'password', onClick: toggleInputType(ref) })))),
        props.errorText
            ? React.createElement(Text, { variant: 'text-sm/normal', className: ClassNamesUtils.ColorClassNames.colorDanger }, props.errorText)
            : null))));
}
const EmptyFormGroup = forwardRef((props, ref) => {
    const internalRef = useRef(null);
    const mergedRef = ref || internalRef;
    return (React.createElement("div", { className: "danho-form-group", onClick: () => {
            if (mergedRef && 'current' in mergedRef && mergedRef.current)
                mergedRef.current.focus();
            props.onClick?.();
        } },
        React.createElement("label", { className: classNames("danho-form-group__label", InputModule.title), htmlFor: props.name }, props.label),
        props.children(mergedRef)));
});
function getInputType(value) {
    if (typeof value === 'boolean')
        return 'checkbox';
    if (typeof value === 'number')
        return 'number';
    if (typeof value === 'string') {
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
            return 'email';
        if (/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value))
            return 'url';
        if (/^\d{10}$/.test(value))
            return 'tel';
        if (/^\d{3}-\d{3}-\d{4}$/.test(value))
            return 'tel';
        if (/^#[0-9A-F]{6}$/i.test(value))
            return 'color';
        if (/\d{4}-\d{2}-\d{2}/.test(value))
            return 'date';
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value))
            return 'datetime-local';
    }
    return 'text';
}

function Modal({ children, open, onClose, title, ...props }) {
    const ref = useRef(null);
    useClickOutside(ref, onClose);
    useKeybind(['Escape'], onClose);
    return (React.createElement("dialog", { open: open, className: classNames('danho-modal', props.className) },
        React.createElement("div", { className: "danho-modal__backdrop" },
            React.createElement("div", { className: "danho-modal__modal-inner", ref: ref },
                React.createElement("div", { className: "danho-modal__header" },
                    React.createElement(Text, { variant: "heading-xl/bold", className: "danho-modal__title" }, title),
                    React.createElement(Button, { look: Button.Looks.BLANK, className: classNames(ColorClassNames.colorDefault, 'danho-modal__close'), onClick: onClose }, "\u00D7")),
                React.createElement("div", { className: "danho-modal__content" }, children)))));
}

function SearchableListInner(props, ref) {
    const { items, renderItem, onSearch } = props;
    const { placeholder = 'Search...', take = 25, className, noResult, children, } = props;
    const [search, setSearch] = useState('');
    const SearchableItem = useCallback(({ item, index }) => renderItem(item, index, items), [renderItem, items]);
    const Children = useCallback(() => (typeof children === 'function' ? children() : children), [children]);
    const filteredItems = useMemo(() => (items
        .filter(item => (search ? onSearch(search, item) : true))
        .slice(0, take)), [items, search, onSearch, take]);
    return (React.createElement("div", { className: classNames('searchable-list', className) },
        React.createElement("div", { className: "searchable-list__input-container" },
            React.createElement("input", { ref: ref, className: "searchable-list__input", type: "text", placeholder: placeholder, value: search, onChange: e => setSearch(e.target.value) }),
            React.createElement(Children, null)),
        React.createElement(ScrollerAuto, { className: ScrollerLooks.thin },
            React.createElement("ul", { className: "searchable-list__items" },
                filteredItems.map((item, index) => (React.createElement("li", { key: index, className: "searchable-list__item" },
                    React.createElement(SearchableItem, { item: item, index: index })))),
                filteredItems.length === 0 && noResult && (React.createElement("li", { className: "searchable-list__item--no-result" }, typeof noResult === 'function' ? noResult() : noResult))))));
}
const SearchableList = forwardRef(SearchableListInner);

function Setting({ setting, settings, set, titles, ...props }) {
    const { beforeChange, onChange, formatValue, type } = props;
    const [v, _setV] = useState(formatValue ? formatValue(settings[setting]) : settings[setting]);
    const setV = (value) => _setV(formatValue ? formatValue(value) : value);
    if (type === undefined ? typeof v === 'boolean' : type === 'switch')
        return (React.createElement("div", { className: "setting-group" },
            React.createElement(FormSwitch, { className: 'danho-form-switch', key: setting.toString(), note: titles[setting.toString()], value: Boolean(v), hideBorder: true, onChange: inputValue => {
                    const checked = beforeChange ? beforeChange(inputValue) : inputValue;
                    set({ [setting]: checked });
                    onChange?.(checked);
                    setV(checked);
                } })));
    if (type === undefined ? typeof v === 'number' : type === 'number')
        return (React.createElement("div", { className: "setting-group" },
            React.createElement(TextInput, { key: setting.toString(), value: v, type: "number", onChange: inputValue => {
                    const value = beforeChange ? beforeChange(inputValue) : Number(inputValue);
                    set({ [setting]: value });
                    onChange?.(value);
                    setV(value);
                } }),
            React.createElement(FormText, { className: 'note' }, titles[setting])));
    if (type === undefined ? typeof v === 'string' : type === 'text')
        return (React.createElement("div", { className: "setting-group" },
            React.createElement(TextInput, { key: setting.toString(), value: v, onChange: inputValue => {
                    const value = beforeChange ? beforeChange(inputValue) : inputValue;
                    set({ [setting]: value });
                    onChange?.(value);
                    setV(value);
                } }),
            React.createElement(FormText, { className: 'note' }, titles[setting])));
    if (type && type !== 'select')
        return (React.createElement("div", { className: "danho-form-switch", key: setting.toString() },
            React.createElement("input", { type: type, key: setting.toString(), value: v, onChange: e => {
                    const value = beforeChange ? beforeChange(e.target.value) : e.target.value;
                    set({ [setting]: value });
                    onChange?.(value);
                    setV(value);
                } }),
            React.createElement(FormText, { className: 'note' }, titles[setting])));
    if (type === 'select')
        return (React.createElement("div", { className: "danho-form-select", key: setting.toString() },
            React.createElement(Select, { ...props, options: 'options' in props ? props.options.map(value => ({ label: value, value })) : undefined, isSelected: value => Array.isArray(settings[setting]) ? v.includes(value) : value === settings[setting], serialize: value => JSON.stringify(value), select: Array.isArray(settings[setting]) ? (value) => {
                    const selected = [...settings[setting]];
                    if (selected.includes(value))
                        selected.splice(selected.indexOf(value), 1);
                    else
                        selected.push(value);
                    set({ [setting]: selected });
                    setV(selected);
                } : (value) => {
                    set({ [setting]: value });
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

function UserListItem(props) {
    const { user, children, className, onClick, openModalOnClick } = props;
    const handleClick = () => {
        if (onClick)
            onClick(user);
        if (openModalOnClick)
            UserUtils.openModal(user.id);
    };
    return (React.createElement("div", { className: classNames("danho-discord-user", onClick && 'clickable', className), onClick: handleClick, onContextMenu: props.onContextMenu },
        React.createElement("img", { src: user.getAvatarURL(), alt: user.username, className: "danho-discord-user__avatar" }),
        React.createElement("section", { className: "danho-discord-user__info" },
            React.createElement(Text, { variant: "text-md/bold", className: "danho-discord-user__displayName" }, user.globalName ?? user.username),
            user.globalName && React.createElement(Text, { variant: "text-sm/normal", className: "danho-discord-user__username" }, user.username),
            children ? typeof children === "function" ? children(user, Text) : children : null)));
}

function Birthday(props) {
    const { birthdate } = props;
    const { hideTimestamp = false, hideIcon = false, timestampStyle = 'T' } = props;
    const unix = useMemo(() => getBirthdate(birthdate).getTime() / 1000, [birthdate]);
    const BirthdateContent = () => (React.createElement("span", { className: "birthdate" },
        React.createElement(TimestampComponent, { format: timestampStyle, unix: unix }),
        React.createElement("span", { className: "space" }, ","),
        React.createElement(TimestampComponent, { format: "R", unix: unix })));
    const BirthdateComponent = (props = {}) => (React.createElement("div", { className: "birthday", ...props },
        !hideIcon && React.createElement("span", { className: "birthday-icon" }, "\uD83C\uDF82"),
        !hideTimestamp && React.createElement(BirthdateContent, null)));
    return (hideTimestamp
        ? React.createElement(Tooltip, { text: React.createElement(BirthdateContent, null), children: BirthdateComponent })
        : React.createElement(BirthdateComponent, null));
}

const CalendarIcon = Finder.findBySourceStrings("M7 1a1 1 0 0 1 1 1v.75c0");

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
        this.result += `${tagName ?? ''}${label ? `[aria-label="${label}"]` : '[aria-label]'} `;
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
    lastChild(tagName) {
        this.result += `${tagName ?? ''}:last-child `;
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
    has(callback) {
        this.result += `:has(${callback(new ElementSelector()).toString()}) `;
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
            if (!isNaN(Number(key)))
                continue;
            this.element.style[key] = value[key];
        }
    }
    setStyleProperty(key, value) {
        key = StringUtils.kebabCaseFromCamelCase(key.toString());
        const style = this.attr('style') ?? '';
        if (!style.includes(key))
            return this.attr('style', `${this.attr('style') ?? ''}${key}: ${value};`, false);
        const regex = new RegExp(`${key}: [^;]*;`, 'g');
        this.attr('style', style.replace(regex, `${key}: ${value};`), false);
        return;
    }
    addClass(className) {
        if (!this.hasClass(className))
            this.element.classList.add(className);
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
    removeClass(className) {
        if (this.hasClass(className))
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
    hasChildren(selector) {
        return this.children(selector).length > 0;
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
        return getFiber(this.element);
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
        const wrapper = this.element.appendChild(createElement("<></>", wrapperProps));
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
        return forceFullRerender(getFiber(this.element));
    }
}
function createElement(html, props = {}, target) {
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

const ClassNameModule = ClassNamesUtils.combineModuleByKeys(['interactive', 'selected'], ['platedWrapper', 'interactiveSelected']);
const SelectedClassNames = [
    ClassNameModule.interactiveSelected,
    ClassNameModule.selected,
];
function useBirthdayNavProps(props) {
    const [result, setResult] = useState(null);
    useEffect(() => {
        const globalNav = $(s => s.ariaLabel('Direct Messages', 'ul'));
        globalNav.children().forEach(child => {
            child.on('click', props.onSiblingClick);
        });
        const cleanup = () => {
            globalNav.children().forEach(child => {
                child.off('click', props.onSiblingClick);
            });
        };
        const firstNavItem = globalNav.children('li', true);
        if (!firstNavItem.element)
            return cleanup;
        const clickableProps = firstNavItem.children(undefined, true).props;
        const result = {
            listItemProps: exclude(firstNavItem.props, 'children', 'onBlur', 'onClick', 'onFocus'),
            clickableProps: Object.assign({}, clickableProps, {
                className: clickableProps.className
                    .split(' ')
                    .filter(className => !SelectedClassNames.includes(className))
                    .join(' '),
                onClick: async (e) => {
                    AppActions.navigate('/channels/@me');
                    await wait(100);
                    globalNav.children('li').forEach(listItem => {
                        SelectedClassNames.forEach(className => (listItem.children(`.${className}`).forEach(child => child.removeClass(className))));
                    });
                    props.onClick(e);
                }
            }),
            selectedClassName: ClassNameModule.selected,
        };
        setResult(result);
        return cleanup;
    }, []);
    return result;
}

function MarkedUserModal({ open, onClose, user, onSubmit }) {
    if (!user)
        return null;
    const displayName = UserUtils.getUsernames(user).shift();
    return (React.createElement(Modal, { open: open, onClose: onClose, title: `Remove ${displayName}'s birthday?`, className: "marked-user-modal" },
        React.createElement("form", { className: 'marked-user-form', onSubmit: e => {
                e.preventDefault();
                onSubmit();
            } },
            React.createElement(Text, { variant: 'text-md/normal' },
                "Are you sure you want to remove ",
                displayName,
                "'s birthday?"),
            React.createElement(Text, { variant: 'text-sm/medium' }, "You will need to add their birthday back to their User note again, if you change your mind."),
            React.createElement("div", { className: "button-panel" },
                React.createElement(Button, { type: 'button', look: Button.Looks.OUTLINED, className: ClassNamesUtils.ColorClassNames.colorDefault, onClick: onClose },
                    "Keep ",
                    displayName,
                    "'s birthday"),
                React.createElement(Button, { type: 'submit', look: Button.Looks.FILLED, color: Button.Colors.RED },
                    "Remove ",
                    displayName,
                    "'s birthday")))));
}

function ModifyDateModal({ open, onClose, date, onSubmit }) {
    const [form, setForm] = useState({});
    if (!date)
        return null;
    return (React.createElement(Modal, { open: open, onClose: onClose, title: `Add a birthday to ${new Date(date).toDateString()}`, className: "modify-date-modal" },
        React.createElement("form", { className: 'modify-date-form', onSubmit: e => {
                e.preventDefault();
                onSubmit(form);
            } },
            React.createElement(EmptyFormGroup, { label: 'Birthday user', name: "userId" }, ref => (React.createElement(SearchableList, { ref: ref, items: UserUtils.getUsersPrioritizingFriends(), onSearch: (search, user) => UserUtils.getUsernames(user, true).some(u => u.includes(search.toLowerCase())), renderItem: user => (React.createElement(UserListItem, { user: user, className: classNames(form.userId === user.id && "border-success"), onClick: () => setForm(state => ({ ...state, userId: user.id })) })) }))),
            React.createElement("div", { className: "button-panel" },
                React.createElement(Button, { type: 'button', look: Button.Looks.OUTLINED, className: ClassNamesUtils.ColorClassNames.colorDefault, onClick: onClose }, "Cancel"),
                React.createElement(Button, { type: 'submit', look: Button.Looks.FILLED, disabled: !form.userId }, form.userId
                    ? `Add ${UserUtils.getUsernames(UserStore.getUser(form.userId)).shift()}'s birthday to ${new Date(date).toDateString()}`
                    : 'Add birthday')))));
}

function ModifyUserModal({ open, onClose, date, user, onSubmit }) {
    const [form, setForm] = useState({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
    });
    if (!user)
        return null;
    const displayName = UserUtils.getUsernames(user).shift();
    return (React.createElement(Modal, { open: open, onClose: onClose, title: `Edit ${displayName}'s birthday`, className: "modify-user-modal" },
        React.createElement("form", { className: 'modify-user-form', onSubmit: e => {
                e.preventDefault();
                onSubmit({
                    birthdate: new Date(form.year, form.month - 1, form.day)
                });
            } },
            React.createElement(FormItemFromModel, { model: form, property: 'day', onModelChange: model => setForm(model), min: 1, max: 31 }),
            React.createElement(FormItemFromModel, { model: form, property: 'month', onModelChange: model => setForm(model), min: 1, max: 12 }),
            React.createElement(FormItemFromModel, { model: form, property: 'year', onModelChange: model => setForm(model), min: 1900, max: new Date().getFullYear() }),
            React.createElement("div", { className: "button-panel" },
                React.createElement(Button, { type: 'button', look: Button.Looks.OUTLINED, className: ClassNamesUtils.ColorClassNames.colorDefault, onClick: onClose }, "Cancel"),
                React.createElement(Button, { type: 'submit', look: Button.Looks.FILLED }, `Edit ${displayName}'s birthday`)))));
}

const Settings = createSettings({
    hideBirthdateIcon: false,
    hideBirthdateTimestamp: false,
    birthdateTimestampStyle: 'd',
    showBirthdayCalendar: true,
    showBirthdayOnNameTag: true,
    updateNotesOnCalendarChange: true,
    dateFormat: 'DD/MM/YYYY',
});
const titles = {
    hideBirthdateIcon: `Hide the birthdate icon`,
    hideBirthdateTimestamp: `Hide the birthdate timestamp`,
    birthdateTimestampStyle: `Birthdate timestamp style`,
    showBirthdayCalendar: `Show birthday calendar in global navigation`,
    showBirthdayOnNameTag: `Show birthday on name tag`,
    updateNotesOnCalendarChange: `Update notes for users when adding their birthday to the calendar`,
    dateFormat: `Preferred date format`,
};

const BirthdayStore = new class BirthdayStore extends DiumStore {
    constructor() {
        super({
            birthdays: {},
            page: {}
        }, 'BirthdayStore', () => {
            this.current.page.currentDate = new Date();
        });
    }
    get dateFormat() {
        return Settings.current.dateFormat;
    }
    getSortedBirthdays() {
        return Object
            .entries(this.current.birthdays)
            .sort(([_, a], [__, b]) => {
            const now = new Date();
            const dateA = new Date(a);
            dateA.setFullYear(now.getFullYear());
            const dateB = new Date(b);
            dateB.setFullYear(now.getFullYear());
            return dateA.getTime() - dateB.getTime();
        })
            .map(([userId, birthdate]) => {
            const birthdateDate = new Date(birthdate);
            return ({
                user: UserStore.getUser(userId),
                unix: TimeUtils.getUnixTime(birthdateDate),
                date: birthdateDate,
                string: `${String(birthdateDate.getMonth() + 1).padStart(2, '0')}-${String(birthdateDate.getDate()).padStart(2, '0')}`,
                turningAge: new Date().getFullYear() - birthdateDate.getFullYear()
            });
        });
    }
    isBirthdayChild(userResolvable) {
        const user = typeof userResolvable === 'object' ? userResolvable : UserStore.getUser(userResolvable);
        if (!user) {
            warn(`User not found for ${userResolvable}`);
            return false;
        }
        const date = this.current.birthdays[user.id] ? new Date(this.current.birthdays[user.id]) : null;
        if (!date)
            return false;
        const now = new Date();
        const sameDay = date.getDate() === now.getDate();
        const sameMonth = date.getMonth() === now.getMonth();
        return sameDay && sameMonth;
    }
    getBirthdateFromNote(note, userId) {
        const match = note.match(BIRTHDAY_REGEX);
        if (!match)
            return null;
        const [birthdate] = match;
        const stored = this.getUserBirthdate(userId);
        if (!stored || stored.toString() !== getBirthdate(birthdate).toString()) {
            this.setUserBirthdate(userId, getBirthdate(birthdate).toString());
            log(`[BirthdayStore] Added birthday for ${userId}`);
        }
        return this.getUserBirthdate(userId).toString();
    }
    getUserBirthdate(userId) {
        const birthdate = this.current.birthdays[userId];
        return birthdate ? new Date(birthdate) : null;
    }
    setBirthday(userId, birthday) {
        return this.setUserBirthdate(userId, birthday.toString());
    }
    setUserBirthdate(userId, birthdate) {
        this.update(current => ({
            ...current,
            birthdays: {
                ...current.birthdays,
                [userId]: birthdate,
            }
        }));
    }
    removeUserBirthday(userId) {
        this.update(current => {
            const { [userId]: _, ...birthdays } = current.birthdays;
            return {
                ...current,
                birthdays
            };
        });
    }
    usePageState() {
        const [state, setState] = this.useState();
        return [state.page, (page) => {
                const newState = typeof page === 'function' ? page(state.page) : page;
                setState(current => ({
                    ...current,
                    page: {
                        ...current.page,
                        ...newState,
                    }
                }));
            }];
    }
    usePageStateSelector(selector) {
        const [state, setState] = this.useState();
        const selectedValue = state.page[selector];
        return [
            selectedValue,
            (value) => {
                setState(current => {
                    const newValue = typeof value === 'function'
                        ? value(selectedValue)
                        : value;
                    return {
                        ...current,
                        page: {
                            ...current.page,
                            [selector]: newValue,
                        }
                    };
                });
            }
        ];
    }
    async loadFriendNotes() {
        groupCollapsed('BirthdayStore.loadFriendNotes()');
        const friendIds = RelationshipStore.getFriendIDs();
        for (let i = 0; i < friendIds.length; i++) {
            const userId = friendIds[i];
            const displayName = UserUtils.getDisplayName(UserStore.getUser(userId));
            log(`Loading friendNotes for ${displayName} (${i + 1}/${friendIds.length})`);
            if (this.getUserBirthdate(userId)) {
                log(`Birthday already set for ${displayName} - skipping`);
                continue;
            }
            const note = await UserNoteActions.getOrRequestNote(userId);
            if (note)
                this.getBirthdateFromNote(note, userId);
            else
                log(`No note found for ${displayName}`);
            await wait(1000);
        }
        log('Finished loading friendNotes');
        groupEnd();
    }
};
DanhoStores.register(BirthdayStore);

function SettingsPanel() {
    const [settings, set] = Settings.useState();
    const { timestampStyle } = Settings.useSelector(s => ({
        timestampStyle: s.birthdateTimestampStyle
    }));
    const props = {
        settings,
        set,
        titles,
    };
    return (React.createElement("div", { className: "danho-plugin-settings" },
        React.createElement(Setting, { setting: "hideBirthdateIcon", ...props }),
        React.createElement(Setting, { setting: "hideBirthdateTimestamp", ...props }),
        React.createElement(Setting, { setting: "birthdateTimestampStyle", ...props, type: "select", options: [
                "D", "d",
                "T", "t",
                "F", "f",
                "R"
            ] }),
        React.createElement(TimestampComponent, { format: timestampStyle, unix: Date.now() / 1000 })));
}

const ClassNamesModule = ClassNamesUtils.combineModuleByKeys(['container', 'tabBody']);
function CalendarPage({ onClose }) {
    const [currentDate, setCurrentDate] = BirthdayStore.usePageStateSelector('currentDate');
    const [modifyDate, setModifyDate] = BirthdayStore.usePageStateSelector('modifyDate');
    const [modifyUser, setModifyUser] = BirthdayStore.usePageStateSelector('modifyUser');
    const [markedUser, setMarkedUser] = BirthdayStore.usePageStateSelector('markedUser');
    const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);
    const ref = useRef(null);
    const birthdays = BirthdayStore.getSortedBirthdays();
    const shouldRenderModals = !!(modifyDate || modifyUser || markedUser);
    useClickOutside(ref, onClose);
    useKeybind(ref, ['Escape'], () => quickSwitcherOpen ? setQuickSwitcherOpen(false) : undefined);
    useKeybind(ref, ['Enter'], () => quickSwitcherOpen ? onClose() : undefined);
    QuickSwitcherStore.addReactChangeListener(() => {
        const isOpen = QuickSwitcherStore.isOpen();
        if (isOpen !== quickSwitcherOpen)
            setQuickSwitcherOpen(isOpen);
    });
    return (React.createElement("div", { ref: ref, className: classNames(CALENDAR_PAGE_CLASSNAME, ClassNamesModule.container) },
        React.createElement(Calendar, { startDate: currentDate, onDateChange: setCurrentDate, onDateClick: setModifyDate }, string => {
            const noYear = string.split('-').slice(1).join('-');
            const children = birthdays
                .filter(b => b.string === noYear)
                .map(({ user, turningAge }) => !user ? null : (React.createElement(UserListItem, { key: user.id, user: user, onContextMenu: ContextMenuUtils.openContextMenu([
                    buildTextItem('birthday-user-open-modal', `Open ${UserUtils.getUsernames(user).shift()}'s profile`, () => UserUtils.openModal(user.id)),
                    buildTextItem('birthday-user-edit', `Edit ${UserUtils.getUsernames(user).shift()}'s birthday`, () => setModifyUser(user)),
                    buildTextItem('birthday-user-remove', `Remove ${UserUtils.getUsernames(user).shift()}'s birthday`, () => setMarkedUser(user), { danger: true })
                ]) }, turningAge && (React.createElement(Text, { variant: "text-md/normal", className: "turning-age" },
                "Turning ",
                turningAge)))));
            return (React.createElement("div", { className: "birthday-users-container" }, children));
        }),
        shouldRenderModals && (React.createElement("div", { className: "modals" },
            modifyDate && (React.createElement(ModifyDateModal, { open: !!modifyDate, onClose: () => setModifyDate(null), date: modifyDate, onSubmit: async (data) => {
                    const { userId } = data;
                    if (!userId)
                        return;
                    const date = new Date(modifyDate);
                    BirthdayStore.setBirthday(userId, date);
                    if (Settings.current.updateNotesOnCalendarChange) {
                        const noteResult = await UserNoteActions.getOrRequestNote(userId);
                        if (noteResult) {
                            const match = noteResult.match(BIRTHDAY_REGEX);
                            const storedString = match ? match[0] : '';
                            const update = storedString
                                ? noteResult.replace(storedString, '')
                                : (noteResult + ` ${StringUtils.formatDate(date, BirthdayStore.dateFormat)}`);
                            UserNoteActions.updateNote(userId, update);
                        }
                    }
                    setModifyDate(null);
                } })),
            modifyUser && (React.createElement(ModifyUserModal, { open: !!modifyUser, onClose: () => setModifyUser(null), user: modifyUser, date: BirthdayStore.getUserBirthdate(modifyUser?.id) ?? new Date(), onSubmit: async (data) => {
                    const { birthdate } = data;
                    BirthdayStore.setBirthday(modifyUser.id, birthdate);
                    if (Settings.current.updateNotesOnCalendarChange) {
                        const noteResult = await UserNoteActions.getOrRequestNote(modifyUser.id);
                        if (noteResult) {
                            const match = noteResult.match(BIRTHDAY_REGEX);
                            const storedString = match ? match[0] : '';
                            UserNoteActions.updateNote(modifyUser.id, noteResult.replace(storedString, StringUtils.formatDate(birthdate, BirthdayStore.dateFormat)));
                        }
                    }
                    setModifyUser(null);
                } })),
            markedUser && (React.createElement(MarkedUserModal, { open: !!markedUser, onClose: () => setMarkedUser(null), user: markedUser, onSubmit: async () => {
                    const stored = BirthdayStore.getUserBirthdate(markedUser.id);
                    BirthdayStore.removeUserBirthday(markedUser.id);
                    if (Settings.current.updateNotesOnCalendarChange) {
                        const noteResult = await UserNoteActions.getOrRequestNote(markedUser.id);
                        if (noteResult)
                            UserNoteActions.updateNote(markedUser.id, noteResult.replace(StringUtils.formatDate(stored, BirthdayStore.dateFormat), ''));
                    }
                    setMarkedUser(null);
                } }))))));
}

function useTimedCheck(callback, delay, dependencies = []) {
    const [value, setValue] = useState(callback());
    useEffect(() => {
        const timer = setTimeout(() => {
            setValue(callback());
        }, delay);
        return () => clearTimeout(timer);
    }, [callback, delay, ...dependencies]);
    return value;
}

function usePageEffects(selected, setSelected) {
    const [initialStyle, setInitialStyle] = useState({});
    useEffect(() => {
        const children = $(s => s.className('base')
            .className('content').and.has(s => s.className('sidebar'))).children();
        setInitialStyle(() => {
            const style = children[1].style ?? {};
            const { display, position } = style;
            return { display, position };
        });
    }, []);
    useTimedCheck(() => {
        const sidebar = $(s => s.className('base').className('content').className('sidebar'));
        const content = sidebar.parent;
        const children = content.children();
        try {
            if (selected || BirthdayStore.current.page.show) {
                children[1].style = {
                    display: 'none',
                    position: 'absolute',
                };
                if (children[2] && !children[2].children(`.${CALENDAR_PAGE_CLASSNAME}`)) {
                    children[2].unmount();
                    delete children[2];
                }
                if (!children[2])
                    content.appendComponent(React.createElement(CalendarPage, { onClose: () => setSelected(false) }), {
                        className: children[1].classes
                    });
            }
            else {
                children[1].style = initialStyle;
                children[2]?.unmount();
                delete children[2];
            }
        }
        catch (error$1) {
            error(error$1);
        }
    }, 500, [selected, initialStyle]);
}

function BirthdayCalendarNavItem() {
    const [selected, setSelected] = BirthdayStore.usePageStateSelector('show');
    const props = useBirthdayNavProps({
        onClick: () => setSelected(true),
        onSiblingClick: () => setSelected(false)
    });
    const className = classNames('danho-birthday-calendar', selected ? props?.selectedClassName : props?.listItemProps.className.replace(props?.selectedClassName ?? '', ''));
    usePageEffects(selected, setSelected);
    return (React.createElement("li", { key: DanhoBirthdayCalendarKey, ...props?.listItemProps ?? {}, className: className },
        React.createElement(Clickable, { ...props?.clickableProps },
            React.createElement("a", { className: AvatarWithTextClassNameModule.link, href: "#", onClick: e => e.preventDefault() },
                React.createElement(AvatarWithText, { innerClassName: AvatarWithTextClassNameModule.avatarWithText, avatar: React.createElement(CalendarIcon, null), name: 'Birthdays' })))));
}

function BirthdayContainer({ birthdate }) {
    const settings = Settings.useSelector(state => ({
        hideIcon: state.hideBirthdateIcon,
        hideTimestamp: state.hideBirthdateTimestamp,
        timestampStyle: state.birthdateTimestampStyle
    }));
    return React.createElement(Birthday, { birthdate: birthdate, ...settings });
}

function afterGlobalNavigation() {
    after(GlobalNavigation, 'Z', ({ result, args: [props] }) => {
        let navItems = result.props.children.props.children;
        const hasVisualRefreshFixNav = navItems.some(i => 'className' in i.props && i.props.className === "danho-nav-group");
        const isCalendarAdded = hasVisualRefreshFixNav
            ? navItems[0].props.children.some((i) => i?.key === DanhoBirthdayCalendarKey)
            : navItems.some((i) => i?.key === DanhoBirthdayCalendarKey);
        if (isCalendarAdded)
            return;
        if (hasVisualRefreshFixNav) {
            navItems = navItems[0].props.children;
        }
        navItems.splice(navItems.length - 1, 0, React.createElement(BirthdayCalendarNavItem, { key: DanhoBirthdayCalendarKey }));
    }, { name: 'GlobalNavigation' });
}

const MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false });

function afterMemberListItem() {
    after(MemberListItem, 'Z', ({ result: _result, args: [props] }) => {
        const result = _result;
        const isBirthdayChild = BirthdayStore.isBirthdayChild(props.user);
        if (!isBirthdayChild)
            return result;
        after(result.props, 'children', ({ result }) => {
            const avatar = result.props.avatar;
            if (!avatar)
                return;
            avatar.props.children = [
                avatar.props.children,
                React.createElement(Tooltip, { text: `It's ${props.user.globalName ?? props.user.username}'s birthday!` }, props => React.createElement("span", { ...props, className: "birthday-child-icon" }, "\uD83C\uDF82"))
            ];
        }, { name: 'MemberListItem Avatar children', once: true });
    }, { name: 'MemberListItem' });
}

const NameTag = Finder.findBySourceStrings(`nameAndDecorators`, `AvatarWithText`);

function afterNameTag() {
    after(NameTag, 'render', ({ result, args: [props] }) => {
        if (!props.avatar.props.src)
            return result;
        const USER_AVATAR_ID_REGEX = /\/avatars\/(\d+)\//;
        const userId = props.avatar.props.src.match(USER_AVATAR_ID_REGEX)?.[1];
        if (!userId)
            return result;
        const user = UserStore.getUser(userId);
        if (!user)
            return result;
        const isBirthdayChild = BirthdayStore.isBirthdayChild(user);
        if (!isBirthdayChild)
            return result;
        result.props.children[0].props.children = [
            result.props.children[0].props.children,
            React.createElement(Tooltip, { text: `It's ${user.globalName ?? user.username}'s birthday!` }, props => React.createElement("span", { ...props, className: "birthday-child-icon" }, "\uD83C\uDF82"))
        ];
    }, { name: 'NameTag' });
}

const UserHeaderUsernameModule = bySource([".pronouns", "discriminatorClass"], { resolve: false });

function afterUserHeaderUsername() {
    after(UserHeaderUsernameModule, 'Z', ({ result, args: [props] }) => {
        const noteData = UserNoteStore.getNote(props.user.id);
        if (!noteData?.note)
            return result;
        const { note } = noteData;
        const birthdate = BirthdayStore.getBirthdateFromNote(note, props.user.id);
        if (!birthdate)
            return result;
        const children = result.props.children[1].props.children;
        children.splice(children.length, 0, React.createElement(BirthdayContainer, { birthdate: birthdate }));
    }, { name: 'UserHeaderUsername' });
}

function patch() {
    afterGlobalNavigation();
    afterMemberListItem();
    afterNameTag();
    afterUserHeaderUsername();
}

function loadStores() {
    BirthdayStore.load();
}

const styles = ".hidden {\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container,\n.button-panel {\n  display: flex;\n  align-items: center;\n  justify-content: end;\n}\n.button-container button,\n.button-panel button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input,\n.button-panel .text-input-container input {\n  padding: 7px;\n}\n\n.clickable {\n  cursor: pointer;\n}\n\n.bd-modal-root {\n  max-height: 90vh !important;\n}\n\n.border-success {\n  border: 1px solid var(--button-positive-background);\n}\n\n.danho-plugin-settings {\n  display: grid;\n  gap: 1rem;\n}\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.danho-form-switch {\n  display: flex;\n  flex-direction: row-reverse;\n  align-items: center;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-form-select,\n.setting-group {\n  display: flex;\n  flex-direction: column-reverse;\n  gap: 0.5rem;\n  margin-top: 1rem;\n}\n\n.danho-form-group {\n  display: grid;\n  gap: 0.5ch;\n  margin-bottom: 1em;\n}\n.danho-form-group:has(.danho-form-group__checkbox) {\n  grid-template-columns: auto 1fr;\n  align-items: center;\n}\n.danho-form-group:has(.danho-form-group__checkbox) div[class*=divider] {\n  display: none;\n}\n.danho-form-group__checkbox {\n  margin: 0;\n}\n.danho-form-group input,\n.danho-form-group select,\n.danho-form-group textarea {\n  background-color: var(--primary-700);\n  border-color: var(--input-border);\n  border-radius: 0.25rem;\n}\n.danho-form-group input::placeholder,\n.danho-form-group select::placeholder,\n.danho-form-group textarea::placeholder {\n  color: var(--input-placeholder-text);\n}\n.danho-form-group input:focus-visible,\n.danho-form-group select:focus-visible,\n.danho-form-group textarea:focus-visible {\n  color: var(--interactive-active);\n}\n.danho-form-group input:hover,\n.danho-form-group select:hover,\n.danho-form-group textarea:hover {\n  color: var(--interactive-hover);\n}\n\n.input-container {\n  display: flex;\n  align-items: center;\n  gap: 0.5ch;\n  position: relative;\n}\n\n.danho-discord-user__displayName, .danho-discord-user__username {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.danho-discord-user {\n  display: flex;\n  align-items: center;\n  gap: 1ch;\n  margin: 0.5rem 0;\n}\n.danho-discord-user__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n  aspect-ratio: 1/1;\n}\n.danho-discord-user__user-info {\n  display: grid;\n}\n.danho-discord-user__displayName {\n  text-align: left;\n}\n.danho-discord-user__username {\n  text-align: left;\n  color: var(--text-normal);\n}\n\n.danho-calendar {\n  display: flex;\n  flex-direction: column;\n  border-left: 1px solid var(--app-border-frame);\n}\n.danho-calendar__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px;\n  background-color: var(--primary-930);\n  border-bottom: 1px solid var(--app-border-frame);\n}\n.danho-calendar__content {\n  padding: 1em;\n  background-color: var(--primary-900);\n  height: 100%;\n}\n.danho-calendar__day-names {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  padding: 0.5em;\n  padding-bottom: calc(0.5em + 1em);\n  place-items: center;\n}\n.danho-calendar__month-days {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 0.5rem;\n}\n.danho-calendar__day {\n  box-sizing: border-box;\n  height: 7rem;\n  overflow: hidden;\n  border-radius: 0.25rem;\n  text-align: center;\n  background-color: var(--primary-830);\n  transition: background-color 300ms, transform 200ms;\n}\n.danho-calendar__day:hover {\n  background-color: var(--primary-760);\n}\n.danho-calendar__day--today {\n  background-color: var(--brand-500);\n}\n.danho-calendar__day--today:hover {\n  background-color: var(--brand-430);\n}\n.danho-calendar__day--empty {\n  visibility: hidden;\n}\n.danho-calendar__day-content {\n  height: 5rem;\n}\n.danho-calendar__day-number {\n  padding-top: 0.7rem;\n}\n\n.danho-modal {\n  position: fixed;\n  inset: 0;\n  height: 100%;\n  width: 100%;\n  background-color: transparent;\n  border: none;\n}\n.danho-modal * {\n  box-sizing: border-box;\n}\n.danho-modal__backdrop {\n  position: fixed;\n  inset: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 999;\n  display: grid;\n  place-items: center;\n}\n.danho-modal__modal-inner {\n  position: relative;\n  background-color: var(--primary-800);\n  padding: 2em;\n  min-height: 25vh;\n  min-width: 18vw;\n  max-height: 90vh;\n  max-width: 66vw;\n  z-index: 1000;\n  border-radius: 0.75em;\n  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n}\n.danho-modal__header {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-bottom: 1em;\n}\n.danho-modal__close {\n  position: absolute;\n  top: 0em;\n  right: -0.9em;\n  cursor: pointer;\n  font-size: 2em;\n}\n.danho-modal__close:hover {\n  color: var(--interactive-hover);\n}\n.danho-modal__content {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  max-height: 100%;\n  width: 100%;\n  overflow: hidden;\n}\n\n.searchable-list {\n  display: grid;\n  gap: 1ch;\n}\n.searchable-list * {\n  box-sizing: border-box;\n}\n.searchable-list__input-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5ch;\n  position: sticky;\n  top: 0;\n}\n.searchable-list__input {\n  height: 100%;\n  width: 100%;\n  padding: 0.25rem 0.5rem;\n  border: 1px solid var(--primary-660);\n  background-color: var(--primary-700);\n  color: var(--text-normal);\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  border-radius: 0.25rem;\n}\n.searchable-list__input:focus {\n  outline: none;\n  border-color: var(--primary-560);\n}\n.searchable-list__items {\n  --min: 10rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(var(--min), 1fr));\n  gap: 1rem;\n  max-height: 20rem;\n}\n.searchable-list__item {\n  overflow: hidden;\n}\n\nspan[class*=timestamp] {\n  color: var(--text-primary);\n}\n\nli.danho-birthday-calendar {\n  display: flex;\n  align-items: center;\n  margin-left: 8px;\n  border-radius: 4px;\n}\n\ndiv:has(> .birthday-child-icon) {\n  position: relative;\n}\n\n.birthday-child-icon {\n  z-index: 1;\n  position: absolute;\n  top: -0.3ch;\n  right: -0.5ch;\n  font-size: 1.4ch;\n}\n\n.space {\n  margin-right: 0.5ch;\n}\n\n.calendar-page .danho-calendar .danho-discord-user {\n  margin-inline: 1ch;\n  justify-content: center;\n}\n.calendar-page .danho-calendar .danho-discord-user__avatar {\n  --size: 3rem;\n}\n.calendar-page .danho-calendar .danho-discord-user__info {\n  overflow: hidden;\n}\n.calendar-page .danho-calendar .turning-age {\n  text-align: left;\n}\n.calendar-page .modify-date-form {\n  width: 100%;\n  max-height: 25rem;\n}\n.calendar-page .modify-date-form .searchable-list__items {\n  max-height: 18rem;\n}\n.calendar-page .marked-user-form {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1em;\n  max-width: 40ch;\n}";

const updateNode = () => $(s => s.ariaLabel("Private channels", 'nav'))?.forceUpdate();
const index = createPlugin({
    start() {
        patch();
        loadStores();
        updateNode();
    },
    stop() {
        updateNode();
    },
    styles,
    Settings,
    SettingsPanel,
});

module.exports = index;

/*@end @*/
