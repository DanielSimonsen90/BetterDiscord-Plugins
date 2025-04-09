/**
 * @name LockChannels
 * @version 1.0.0
 * @author danhosaur
 * @authorLink https://github.com/danhosaur
 * @description This plugin will lock your selected channels, so your snoopy friends, siblings, parents or partner won't look at the nsfw memes you're posting in general...\nOn a real note, this plugin will allow you to lock a channel behind your own password. Edit in settings or right click on the channel you wish to lock.
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/LockChannels
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
  "name": "lock-channels",
  "version": "1.0.0",
  "author": "danhosaur",
  "description": "This plugin will lock your selected channels, so your snoopy friends, siblings, parents or partner won't look at the nsfw memes you're posting in general...\nOn a real note, this plugin will allow you to lock a channel behind your own password. Edit in settings or right click on the channel you wish to lock."
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

const SortedGuildStore = /* @__PURE__ */ byName("SortedGuildStore");

const { React } = BdApi;
const { ReactDOM } = BdApi;
const classNames$1 = /* @__PURE__ */ find$1((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const EventEmitter = /* @__PURE__ */ find$1((exports) => exports.prototype instanceof Object && Object.prototype.hasOwnProperty.call(exports.prototype, "prependOnceListener"));

const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const Button$1 = /* @__PURE__ */ byKeys(["Colors", "Link"], { entries: true });

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify", "Align"], { entries: true });

const { FormSection, FormItem: FormItem$1, FormTitle, FormText,
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

const debugLog = (...data) => getMeta().development ? log(...data) : undefined;
const debugWarn = (...data) => getMeta().development ? warn(...data) : undefined;
const Logger = {
    ...diumLogger,
    debugLog,
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
        if ((filter && backupId && id !== backupId) || !filter && id === backupId)
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
        if (backupId && backupId === id)
            debugLog('Found by id', { exports, id });
        return filter;
    };
    const moduleCallbackBoundary = (exports, _, id) => {
        try {
            return moduleCallback(exports, _, id);
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
    const moduleSearchOptions = searchOptions ?? { searchExports: true };
    return showMultiple
        ? BdApi.Webpack.getModules(moduleCallbackBoundary, moduleSearchOptions)
        : BdApi.Webpack.getModule(moduleCallbackBoundary, moduleSearchOptions);
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

const GuildActions = byKeys(["requestMembers"]);

const UserNoteActions = byKeys(["updateNote"]);

const ChannelStore = byName("ChannelStore");

const GuildChannelStore = byKeys(["getTextChannelNameDisambiguations"]);
GuildChannelStore.constructor.prototype.getSortedChannels = function getSortedChannels(guildId) {
    const getChannelsResult = this.getChannels(guildId);
    delete getChannelsResult.count;
    delete getChannelsResult.id;
    const channels = Object
        .values(getChannelsResult)
        .flat()
        .filter((entry, index, array) => array.findIndex(bEntry => bEntry.channel.id === entry.channel.id) === index)
        .map(entry => Object.assign({ channelType: entry.channel.type }, entry.channel));
    const categories = channels.filter(channel => channel.type === 4 );
    return categories.flatMap(category => [category, ...channels
            .filter(channel => channel.parent_id === category.id)
            .sort((a, b) => a.position - b.position)
    ]);
};

const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const GuildEmojiStore = byKeys(["getEmojis"]);

const GuildMemberStore = byName("GuildMemberStore");

const GuildStore = byName("GuildStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const MessageStore = byName("MessageStore");

const PresenceStore = /* @__PURE__ */ byName("PresenceStore");

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

const UserStore = Finder.byName("UserStore");

const UserTypingStore = byKeys(["getTypingUsers", "isTyping"]);

const VoiceStore = byKeys(["getVoiceStateForUser"]);
VoiceStore.getVoiceStateArrayForChannel = (function (channelId) {
    const voiceStates = this.getVoiceStatesForChannel(channelId);
    return Object.values(voiceStates);
}).bind(VoiceStore);

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
const ContextMenuUtils = {
    getGroupContaining,
};

function wait(callbackOrTime, time) {
    const callback = (() => undefined);
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

function pick(from, ...properties) {
    if (!from)
        throw new Error("Cannot pick from undefined!");
    return properties.reduce((acc, prop) => {
        acc[prop] = from[prop];
        return acc;
    }, {});
}
function exclude(from, ...properties) {
    if (!from)
        return from;
    return Object.keys(from).reduce((acc, key) => {
        if (!properties.includes(key))
            acc[key] = from[key];
        return acc;
    }, {});
}
function difference(source, target, exclude) {
    const diffKeys = new Set([...Object.keys(source), ...Object.keys(target)]);
    exclude?.forEach(key => diffKeys.delete(key));
    return [...diffKeys.values()].reduce((acc, key, i, arr) => {
        const sourceValue = JSON.stringify(source[key]);
        const targetValue = JSON.stringify(target[key]);
        if (sourceValue !== targetValue)
            acc[key] = target[key];
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
function combineModules$1(...modules) {
    return modules.reduce((combined, sourceStrings) => {
        const module = Finder.byKeys(sourceStrings);
        if (!module) {
            Logger.warn(`[ObjectUtils.combineModules] Module not found for source strings: ${sourceStrings.join(', ')}`);
            return combined;
        }
        for (const key in module) {
            let prop = key;
            if (key in combined) {
                const duplicateIndex = Object.keys(combined).filter(k => k.startsWith(`${key}--`)).length;
                prop = `${key}--${duplicateIndex}`;
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
}
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
const ObjectUtils = {
    pick, exclude, isEqual,
    difference, combine, combineModules: combineModules$1,
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
const StringUtils = {
    join,
    kebabCaseFromCamelCase, kebabCaseFromPascalCase,
    pascalCaseFromSnakeCase, pascalCaseFromCamelCase,
    generateRandomId,
};

const ChannelUtils = {
    ...ChannelStore,
    ...GuildChannelStore,
    ...SelectedChannelStore,
    get current() {
        return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
    },
    get currentChannelId() {
        return SelectedChannelStore.getChannelId();
    },
    getUrl(channelResolve, guildId) {
        const channel = typeof channelResolve === 'string' ? ChannelStore.getChannel(channelResolve) : channelResolve;
        if (!channel)
            return '';
        guildId ??= channel.getGuildId() ?? '@me';
        return `https://discord.com/channels/${guildId}/${channel.id}`;
    },
    getMessageUrl(channelId, messageId, guildId = '@me') {
        return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
    }
};

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
            get status() {
                return PresenceStore.getStatus(user.id);
            }
        });
    },
    getPresenceState: () => PresenceStore.getState(),
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
};

const useGuildFeatures = Finder.findBySourceStrings("hasFeature", "GUILD_SCHEDULED_EVENTS");
const GuildUtils = {
    ...GuildStore,
    ...GuildMemberStore,
    ...GuildChannelStore,
    ...GuildEmojiStore,
    ...SortedGuildStore,
    ...SelectedGuildStore,
    ...VoiceStore,
    ...GuildActions,
    useGuildFeatures(guild) {
        return useGuildFeatures(guild) || [];
    },
    get current() {
        return GuildStore.getGuild(SelectedGuildStore.getGuildId());
    },
    get currentId() {
        return SelectedGuildStore.getGuildId();
    },
    get me() {
        return GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), UserStore.getCurrentUser().id);
    },
    meFor(guildId) {
        return GuildMemberStore.getMember(guildId, UserStore.getCurrentUser().id);
    },
    getSelectedGuildTimestamps() {
        return SelectedGuildStore.getState().selectedGuildTimestampMillis;
    },
    getIconUrl(guild) {
        return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png';
    },
    getEmojiIcon(emojiId, size = 128) {
        return `https://cdn.discordapp.com/emojis/${emojiId}.webp?size=${size}&quality=lossless`;
    },
    getMembers(guild) {
        return GuildMemberStore.getMembers(guild);
    },
    getGuildByName(name) {
        return Object.values(GuildStore.getGuilds()).find(guild => guild.name === name) || null;
    },
    getGuildRoleWithoutGuildId(roleId) {
        return GuildStore.getRole(SelectedGuildStore.getGuildId(), roleId);
    },
    getMemberAvatar(memberId, guildId, size) {
        const avatar = GuildMemberStore.getMember(guildId, memberId).avatar;
        if (avatar)
            return `https://cdn.discordapp.com/guilds/${guildId}/users/${memberId}/avatars/${avatar}.webp?size=${size}`;
        return;
    },
    getOwner(guildId, openModal = false, showGuildProfile = true) {
        const guild = guildId ? GuildStore.getGuild(guildId) : GuildUtils.current;
        if (!guild)
            return null;
        const owner = UserStore.getUser(guild.ownerId);
        if (owner && openModal)
            UserUtils.openModal(owner.id, showGuildProfile);
        return owner;
    },
    getSortedGuilds() {
        return SortedGuildStore
            .getFlattenedGuildIds()
            .reduce((acc, guildId) => {
            const guild = GuildStore.getGuild(guildId);
            if (guild)
                acc[guildId] = guild;
            return acc;
        }, {});
    },
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
        return forceFullRerender(getFiber(this.element));
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

const { useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useId, useDeferredValue, useInsertionEffect, useSyncExternalStore, useTransition, createRef, createContext, createElement, createFactory, forwardRef, cloneElement, lazy, memo, isValidElement, Component, PureComponent, Fragment, Suspense, } = React;

const Collapsible = forwardRef(({ children, ...props }, ref) => {
    const internalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);
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
    useEffect(() => {
        if (props.forceState !== undefined) {
            setIsOpen(props.forceState);
            if (props.forceState)
                props.onOpen?.();
            else
                props.onClose?.();
        }
    }, [props.forceState]);
    useImperativeHandle(ref, () => ({
        ...internalRef.current,
        isOpen,
        isDisabled: disabled,
        toggle,
        open: () => {
            setIsOpen(true);
            props.onOpen?.();
        },
        close: () => {
            setIsOpen(false);
            props.onClose?.();
        },
    }));
    const Title = typeof props.title === "string" ? React.createElement("h3", null, props.title) : props.title;
    const TitleOpen = typeof props.titleOpen === "string" ? React.createElement("h3", null, props.titleOpen) : props.titleOpen;
    return (React.createElement("div", { ref: internalRef, className: classNames$1("collapsible", props.className), "data-open": isOpen, "data-disabled": disabled },
        React.createElement("div", { className: "collapsible__header", onClick: toggle },
            isOpen ? TitleOpen ?? Title : Title,
            React.createElement("span", { style: { display: "flex" } })),
        React.createElement("div", { className: classNames$1("collapsible__content", isOpen ? "visible" : "hidden") }, children)));
});

function classNames(...classNames) {
    return classNames.filter(Boolean).join(' ');
}

function useKeybind(keybinds, onKeybind) {
    const [isCtrl, isShift, isAlt] = ['Control', 'Shift', 'Alt'].map(k => keybinds.includes(k));
    const _keybinds = keybinds.filter(k => !['Control', 'Shift', 'Alt'].includes(k));
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
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [keybinds, onKeybind]);
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

const InputModule = ClassNamesUtils.combineModuleByKeys(['inputWrapper', 'inputDefault'], ['dividerDefault', 'title']);
function FormItem(props) {
    const { value, label, type } = props;
    return React.createElement(FormGroup, { ...props, name: props.name ?? label, inputType: type ?? getInputType(value) });
}
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
        if (ref.current) {
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
            React.createElement("input", { className: className, ref: ref, type: inputType, placeholder: props.inputType === 'checkbox' ? undefined : props.label, name: props.name, required: props.required, disabled: props.disabled, defaultValue: props.defaultValue, checked: typeof internal === 'boolean' ? internal : undefined, value: typeof internal === 'boolean' ? undefined : internal, onChange: e => {
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
function EmptyFormGroup(props) {
    const internalRef = useRef(null);
    const ref = props.ref ?? internalRef;
    return (React.createElement("div", { className: "danho-form-group", onClick: () => {
            if (ref.current)
                ref.current.focus();
            props.onClick?.();
        } },
        React.createElement("label", { className: classNames("danho-form-group__label", InputModule.title), htmlFor: props.name }, props.label),
        props.children(ref)));
}
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

function GuildListItem(props) {
    const guildId = React.useMemo(() => 'guildId' in props ? props.guildId : props.guild.id, [props]);
    const guild = React.useMemo(() => 'guild' in props ? props.guild : GuildStore.getGuild(guildId), [guildId]);
    const { children } = props;
    return (React.createElement("div", { className: "guild-list-item" },
        React.createElement("img", { className: "guild-list-item__icon", src: window.DL.Utils.GuildUtils.getIconUrl(guild), alt: guild.name }),
        React.createElement("div", { className: "guild-list-item__content-container" },
            React.createElement("span", { className: "guild-list-item__name" }, guild.name),
            React.createElement("span", { className: "guild-list-item__content" }, children))));
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
const Button = Finder.findBySourceStrings("FILLED", "BRAND", "MEDIUM", "button", "buttonRef");

function SearchableList(props) {
    const { items, renderItem, onSearch } = props;
    const { placeholder = 'Search...', className, noResult, take, children } = props;
    const [search, _setSearch] = useState('');
    const setSearch = useDebounceCallback((value) => _setSearch(value), 300);
    const SearchableItem = useCallback(({ item, index }) => renderItem(item, index, items), [renderItem, items]);
    const Children = useCallback(() => typeof children === 'function' ? children() : children, [children]);
    const filteredItems = useMemo(() => (items
        .filter(item => search ? onSearch(search, item) : true)
        .slice(0, take ?? 25)), [items, search, onSearch, take]);
    return (React.createElement("div", { className: classNames('searchable-list', className) },
        React.createElement("div", { className: "searchable-list__input-container" },
            React.createElement("input", { className: "searchable-list__input", type: "text", placeholder: placeholder, value: search, onChange: e => setSearch(e.target.value) }),
            React.createElement(Children, null)),
        React.createElement("ul", { className: "searchable-list__items" },
            filteredItems.map((item, index) => (React.createElement("li", { key: index, className: "searchable-list__item" },
                React.createElement(SearchableItem, { item: item, index: index })))),
            filteredItems.length === 0 && noResult && (React.createElement("li", { className: "searchable-list__item--no-result" }, typeof noResult === 'function' ? noResult() : noResult)))));
}

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
            React.createElement(TextInput, { key: setting.toString(), value: v, onChange: inputValue => {
                    const value = beforeChange ? beforeChange(Number(inputValue)) : Number(inputValue);
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
            React.createElement(Select, { options: props.options.map(value => ({ label: value, value })), isSelected: value => Array.isArray(settings[setting]) ? v.includes(value) : value === settings[setting], serialize: value => JSON.stringify(value), select: Array.isArray(settings[setting]) ? (value) => {
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

const LockedChannelsStore = new class LockedChannelsStore extends DiumStore {
    constructor() {
        super({
            channels: {},
            timeouts: {}
        }, 'LockedChannelsStore');
    }
    getChannelState(channelId) {
        return this.current.channels[channelId];
    }
    getChannelTimeout(channelId) {
        return this.current.timeouts[channelId];
    }
    isLocked(channelId) {
        const stored = this.getChannelState(channelId);
        if (!stored)
            return false;
        const timeout = this.getChannelTimeout(channelId);
        return stored.initialLockState ? !timeout : !!timeout;
    }
    isUnlocked(channelId) {
        return !this.isLocked(channelId);
    }
    hasLock(channelId) {
        return !!this.getChannelState(channelId);
    }
    lock(channelId) {
        this.updateLockTimeout(channelId, undefined);
        ActionsEmitter.emit('LOCK_CHANNEL', { channelId });
        const stored = this.getChannelState(channelId);
        if (stored && !stored.initialLockState) {
            this.startLockTimeout(channelId, stored.unlockedForMinutes);
        }
    }
    login(channelId, password) {
        const stored = this.getChannelState(channelId);
        let success = stored
            ? stored.once
                ? stored.once.password === password
                : stored.password === password
            : true;
        if (success) {
            this.unlock(channelId);
            if (stored.once)
                this.updateLockState(channelId, { once: undefined });
        }
        return success;
    }
    setLockState(channelId, state, once = false) {
        return this.updateLockState(channelId, state, false, once);
    }
    deleteLock(channelId) {
        this.unlock(channelId);
        this.updateLockState(channelId, undefined, true);
        this.updateLockTimeout(channelId, undefined);
    }
    unlock(channelId) {
        const stored = this.getChannelState(channelId);
        if (stored.initialLockState) {
            const timeout = this.getChannelTimeout(channelId);
            if (timeout)
                clearTimeout(timeout);
            this.startLockTimeout(channelId, stored.unlockedForMinutes);
        }
    }
    updateLockState(channelId, state, replace, once) {
        const stored = (replace ? undefined : this.getChannelState(channelId)) ?? {};
        const update = { ...stored, ...state };
        this.update(current => {
            if (!once && replace && !state) {
                const { [channelId]: _, ...channels } = current.channels;
                return { channels };
            }
            return {
                channels: {
                    ...current.channels,
                    [channelId]: once ? { ...stored, once: update } : update
                }
            };
        });
        return update;
    }
    updateLockTimeout(channelId, timeout) {
        this.update(current => {
            if (current.timeouts[channelId])
                clearTimeout(current.timeouts[channelId]);
            if (timeout)
                return {
                    timeouts: {
                        ...current.timeouts,
                        [channelId]: timeout
                    }
                };
            const timeouts = { ...current.timeouts };
            delete timeouts[channelId];
            return { timeouts };
        });
    }
    startLockTimeout(channelId, unlockedForMinutes) {
        this.updateLockTimeout(channelId, setTimeout(() => this.updateLockTimeout(channelId, undefined), unlockedForMinutes * 60 * 1000));
    }
    useSettings() {
        const lockedChannels = this.useSelector(state => Object.keys(state.channels).reduce((acc, lockedChannelId) => {
            const stored = state.channels[lockedChannelId];
            const timeout = state.timeouts[lockedChannelId];
            const channel = ChannelStore.getChannel(lockedChannelId);
            return {
                ...acc,
                [lockedChannelId]: {
                    stored,
                    timeout,
                    channel
                }
            };
        }, {}));
        const guildsSet = Object.values(lockedChannels).reduce((acc, { channel }) => {
            if (channel.guild_id)
                acc.add(channel.guild_id);
            return acc;
        }, new Set());
        const sortedGuilds = Object.entries(GuildUtils.getSortedGuilds())
            .filter(([guildId]) => guildsSet.has(guildId))
            .map(([guildId, guild]) => ({
            guildId,
            guildName: guild.name,
            channels: Object
                .values(lockedChannels)
                .filter(({ channel }) => channel.guild_id === guildId)
        }));
        return sortedGuilds;
    }
};
DanhoStores.register(LockedChannelsStore);

function loadStores() {
    LockedChannelsStore.load();
}

const Settings = createSettings({
    initialLockState: true,
    unlockedForMinutes: 5,
});
const titles = {
    initialLockState: `Initial lock state for channels`,
    unlockedForMinutes: `Minutes to lock channels for`,
};

function ChannelLockEditForm({ channel, onSubmit, onDelete }) {
    const settings = Settings.useCurrent();
    const lockedChannel = LockedChannelsStore.useSelector(state => state.channels[channel.id]);
    const defaultState = useMemo(() => ({
        initialLockState: lockedChannel?.initialLockState || settings.initialLockState,
        password: lockedChannel?.password,
        unlockedForMinutes: lockedChannel?.unlockedForMinutes || settings.unlockedForMinutes,
    }), [lockedChannel, settings]);
    const [state, setState] = useState(defaultState);
    const hasChanges = useMemo(() => !ObjectUtils.isEqual(defaultState, state), [state, defaultState]);
    return (React.createElement("form", { className: 'lock-channel-form', onSubmit: e => {
            e.preventDefault();
            onSubmit(state, true);
        } },
        React.createElement(FormItemFromModel, { model: state, property: 'initialLockState', onModelChange: model => setState(model), required: true }),
        React.createElement(FormItemFromModel, { model: state, property: 'unlockedForMinutes', onModelChange: model => setState(model), required: true }),
        React.createElement(FormItemFromModel, { model: state, property: 'password', onModelChange: model => setState(model), required: true, type: 'password', ephemeralEyeSize: 32 }),
        React.createElement("div", { className: "button-panel" },
            onDelete && (React.createElement(Button, { type: "button", look: Button.Looks.OUTLINED, color: Button.Colors.RED, onClick: onDelete }, "Delete Lock")),
            React.createElement(Button, { type: "submit", look: Button.Looks.OUTLINED, color: Button.Colors.BRAND, disabled: !hasChanges, onClick: () => onSubmit(state, false) }, "Lock and Save"),
            React.createElement(Button, { type: "submit", look: Button.Looks.FILLED, color: Button.Colors.BRAND, disabled: !hasChanges }, "Lock"))));
}

function ChannelLockModalContent({ channel }) {
    const collapsibleRef = useRef(null);
    function onSubmit(editState, once) {
        LockedChannelsStore.setLockState(channel.id, editState, once);
        collapsibleRef.current?.close();
    }
    return (React.createElement(Collapsible, { ref: collapsibleRef, title: "Edit Channel Lock", defaultOpen: !LockedChannelsStore.hasLock(channel.id) },
        React.createElement(ChannelLockEditForm, { onSubmit: onSubmit, channel: channel })));
}

const LOGIN_ID = 'secret-channel-login';
function Login({ onSubmit }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);
    useKeybind(['Enter'], () => document.getElementById(LOGIN_ID)?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })));
    function onIncorrect() {
        setPassword('');
        setError("Incorrect password");
    }
    function handleSubmit(e) {
        e.preventDefault();
        const password = e.currentTarget.password.value;
        if (!password)
            return;
        const success = onSubmit(password);
        if (!success)
            return onIncorrect();
    }
    function onChange(value) {
        setPassword(value);
        if (error)
            setError(undefined);
    }
    return (React.createElement("form", { id: LOGIN_ID, onSubmit: handleSubmit },
        React.createElement(Text, null, "This channel is locked. Please enter the password to access it."),
        React.createElement(FormItem, { type: 'password', ephemeralEyeSize: 32, name: "password", label: 'Password', value: password, onChange: onChange, required: true, errorText: error }),
        React.createElement(Button$1, { type: "submit" }, "Login")));
}

let debouncedLoginRemover;
async function lockChannel(channelId) {
    log('Channel selected', {
        channelId,
        state: LockedChannelsStore.getChannelState(channelId),
        timeout: LockedChannelsStore.getChannelTimeout(channelId),
    });
    if (!channelId || LockedChannelsStore.isUnlocked(channelId)) {
        if (debouncedLoginRemover)
            clearTimeout(debouncedLoginRemover);
        if (document.getElementById(LOGIN_ID))
            debouncedLoginRemover = setTimeout(() => document.getElementById(LOGIN_ID)?.parentElement.remove(), 100);
        log('Nothing to see here...', {
            channel: ChannelStore.getChannel(channelId).name,
            state: LockedChannelsStore.getChannelState(channelId),
            isLocked: LockedChannelsStore.isLocked(channelId),
            isUnlocked: LockedChannelsStore.isUnlocked(channelId),
        });
        return;
    }
    await wait(1);
    log('After that wait');
    const contentContainer = $(s => s.className('content').directChild().and.className('page'));
    if (!contentContainer)
        return log(`Could not find content container`, {
            get contentContainer() {
                return $(s => s.className('content').directChild().and.className('page'));
            }
        });
    if (LockedChannelsStore.isLocked(channelId) && !document.getElementById(LOGIN_ID)) {
        contentContainer.insertComponent('afterbegin', (React.createElement(Login, { onSubmit: password => {
                const correct = LockedChannelsStore.login(channelId, password);
                if (!correct)
                    return false;
                $(`#${LOGIN_ID}`).parent.unmount();
                return true;
            } })));
    }
}

function onChannelSelect() {
    ActionsEmitter.on('CHANNEL_SELECT', async ({ channelId }) => lockChannel(channelId));
    ActionsEmitter.on('LOCK_CHANNEL', data => data?.channelId ? lockChannel(data.channelId) : undefined);
}

function subscribeToActions() {
    onChannelSelect();
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
function buildTextItemElement(id, label, action, props = {}) {
    return BdApi.ContextMenu.buildItem(buildTextItem(id, label, action, props));
}

function PatchChannelContextMenu(callback) {
    const unpatch = BdApi.ContextMenu.patch('channel-context', (tree, props) => {
        return callback(tree, props, unpatch);
    });
    return unpatch;
}

function patchChannelContextMenu() {
    PatchChannelContextMenu((menu, { channel }) => {
        const channelManagement = ContextMenuUtils.getGroupContaining('delete-channel', menu);
        if (!channelManagement) {
            Logger.warn('Could not find channel management group in context menu (looked for "delete-channel")', { menu });
            return;
        }
        const { name: channelName, id: channelId } = channel;
        const lockingOption = LockedChannelsStore.isLocked(channelId) ? undefined : buildTextItemElement('danho-lock-channel', 'Lock Channel', () => BdApi.UI.showConfirmationModal(`Locking #${channelName}`, React.createElement(ChannelLockModalContent, { channel: channel }), {
            confirmText: `Lock #${channelName}`,
            onConfirm: () => LockedChannelsStore.lock(channelId),
            onCancel: () => LockedChannelsStore.setLockState(channelId, undefined, true),
        }), {
            danger: true
        });
        const deletingOption = LockedChannelsStore.isLocked(channelId) || !LockedChannelsStore.hasLock(channelId)
            ? undefined
            : buildTextItemElement('danho-delete-lock', 'Delete Lock', () => BdApi.UI.showConfirmationModal(`Deleting lock on #${channelName}`, `Are you sure you want to delete the lock on #${channelName}?`, {
                confirmText: 'Delete Lock',
                onConfirm: () => LockedChannelsStore.deleteLock(channelId),
            }), {
                danger: true
            });
        channelManagement.push(...[lockingOption, deletingOption].filter(Boolean));
    });
}

function patch() {
    patchChannelContextMenu();
}

function LockedChannelsSettings({ settings, set, titles }) {
    const guilds = LockedChannelsStore.useSettings();
    const onEditSubmit = (channelId) => (state, once) => {
        LockedChannelsStore.setLockState(channelId, state, once);
    };
    const onDeleteSubmit = (channelId) => () => {
        LockedChannelsStore.deleteLock(channelId);
    };
    return (React.createElement("ul", { className: 'locked-channels-settings-list' }, guilds.map(({ guildId, guildName, channels }) => (React.createElement(GuildListItem, { key: guildId, guildId: guildId },
        React.createElement(Collapsible, { title: `Open to view the locked channels of ${guildName}`, titleOpen: 'Locked Channels' },
            React.createElement(SearchableList, { items: channels, onSearch: (search, channelInfo) => (channelInfo.channel.name.toLowerCase().includes(search.toLowerCase())), renderItem: ({ channel, stored, timeout }) => (React.createElement("li", { key: channel.id, "data-channel-id": channel.id },
                    React.createElement(Collapsible, { title: `#${channel.name}`, titleOpen: `Edit lock for #${channel.name}` },
                        React.createElement(ChannelLockEditForm, { channel: channel, onSubmit: onEditSubmit(channel.id), onDelete: onDeleteSubmit(channel.id) })))), placeholder: 'Search for a channel...', noResult: 'No channels found' })))))));
}

function SettingsPanel() {
    const [settings, set] = Settings.useState();
    const props = {
        settings,
        set,
        titles,
    };
    return (React.createElement("div", { className: "danho-plugin-settings" },
        React.createElement(FormSection, { title: "General Settings" },
            React.createElement(Setting, { setting: "unlockedForMinutes", ...props, type: "number" }),
            React.createElement(Setting, { setting: "initialLockState", ...props })),
        React.createElement(FormSection, { title: "Locked Channels" },
            React.createElement(LockedChannelsSettings, { ...props }))));
}

const styles = ".collapsible {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 1px solid var(--primary-500);\n  border-radius: 4px;\n  overflow: hidden;\n  margin: 1rem 0;\n}\n.collapsible__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 1rem;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.collapsible__header > span::after {\n  content: \"\";\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid var(--interactive-muted);\n  margin-left: 0.5rem;\n}\n.collapsible__header > span::after:hover {\n  border-top-color: var(--interactive-hover);\n}\n.collapsible__content {\n  padding: 0.5rem 1rem;\n  background-color: var(--background-secondary);\n  border-top: 1px solid var(--primary-500);\n}\n.collapsible__content.hidden {\n  display: none;\n}\n.collapsible[data-open=true] > .collapsible__header > span::after {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid var(--interactive-normal);\n}\n.collapsible[data-disabled=true] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.ephemeral-eye {\n  --size: 16px;\n  color: var(--text-muted);\n  position: absolute;\n  right: calc(var(--size) * -1 - 1ch);\n  top: 60%;\n  transform: translateY(-50%);\n}\n.ephemeral-eye__line {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0.125rem;\n  height: 1remw;\n  background-color: var(--text-muted);\n  transform: translate(-50%, -50%) rotate(45deg);\n}\n\n.guild-list-item {\n  display: flex;\n  flex-direction: row;\n  font-size: 24px;\n  align-items: center;\n}\n.guild-list-item__icon {\n  --size: 2rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  margin-right: 1ch;\n}\n.guild-list-item__content-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 1rem;\n}\n.guild-list-item__name {\n  font-weight: bold;\n  color: var(--text-primary);\n}\n.guild-list-item__content {\n  color: var(--text-tertiary);\n}\n\n.custom-message {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 0.5ch;\n}\n.custom-message__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n}\n.custom-message__main {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5ch;\n}\n.custom-message__main header {\n  display: flex;\n  align-items: center;\n  gap: 0.5ch;\n}\n.custom-message .user-mention, .custom-message .role-mention {\n  color: var(--mention-foreground);\n  background-color: var(--mention-background);\n}\n.custom-message .user-mention::before, .custom-message .role-mention::before {\n  content: \"@\";\n}\n.custom-message .channel-mention::before {\n  content: \"#\";\n}\n.custom-message .custom-message__attachments img {\n  max-height: 100%;\n  max-width: 100%;\n}\n\n.progress-bar {\n  width: 100%;\n  height: 0.5rem;\n  border-radius: 0.5rem;\n  overflow: hidden;\n}\n.progress-bar__fill {\n  height: 100%;\n  background-color: var(--primary-600);\n  transition: width 0.3s;\n}\n\n.searchable-list {\n  display: grid;\n  gap: 1ch;\n}\n.searchable-list * {\n  box-sizing: border-box;\n}\n.searchable-list__input-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5ch;\n  position: sticky;\n  top: 0;\n}\n.searchable-list__input {\n  height: 100%;\n  width: 100%;\n  padding: 0.25rem 0.5rem;\n  border: 1px solid var(--primary-660);\n  background-color: var(--primary-700);\n  color: var(--text-normal);\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  border-radius: 0.25rem;\n}\n.searchable-list__input:focus {\n  outline: none;\n  border-color: var(--primary-560);\n}\n.searchable-list__items {\n  --min: 10rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(var(--min), 1fr));\n  gap: 1rem;\n}\n.searchable-list__item {\n  overflow: hidden;\n}\n\n.tab-bar {\n  max-width: 100%;\n}\n.tab-bar * {\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n\n.tab-bar__tabs {\n  display: grid;\n  grid-auto-flow: column;\n  max-width: 100%;\n  overflow: auto hidden;\n}\n.tab-bar__tabs--no-color .tab-bar__tab {\n  background-color: transparent;\n  border: none;\n}\n\n.tab-bar__tab {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border: none;\n  background-color: var(--primary-630);\n  color: var(--text-muted);\n  border: 1px solid var(--border-faint);\n  padding: 0.3rem 1rem;\n}\n.tab-bar__tab:hover {\n  background-color: var(--primary-600);\n  color: var(--text-primary);\n}\n.tab-bar__tab--active {\n  border: 1px solid var(--border-faint);\n  border-bottom: 1px solid var(--text-primary) !important;\n  color: var(--text-primary);\n}\n\n.tab-bar__content {\n  padding: 1em;\n  background-color: var(--primary-630);\n  border: 1px solid var(--border-faint);\n}\n.tab-bar__content--no-color {\n  background-color: transparent;\n  border: none;\n}\n.tab-bar__content-page:not(.tab-bar__content-page--active) {\n  opacity: 0;\n  z-index: -1;\n  pointer-events: none;\n  height: 0;\n}\n\n.danho-discord-user {\n  display: flex;\n  align-items: center;\n  gap: 1ch;\n  margin: 0.5rem 0;\n}\n.danho-discord-user__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n  aspect-ratio: 1/1;\n}\n.danho-discord-user__user-info {\n  display: grid;\n}\n.danho-discord-user__displayName {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.danho-discord-user__username {\n  color: var(--text-normal);\n}\n\n.danho-form-switch {\n  display: flex;\n  flex-direction: row-reverse;\n  align-items: center;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-form-select,\n.setting-group {\n  display: flex;\n  flex-direction: column-reverse;\n  gap: 0.5rem;\n  margin-top: 1rem;\n}\n\n.danho-form-group {\n  display: grid;\n  gap: 0.5ch;\n  margin-bottom: 1em;\n}\n.danho-form-group:has(.danho-form-group__checkbox) {\n  grid-template-columns: auto 1fr;\n  align-items: center;\n}\n.danho-form-group:has(.danho-form-group__checkbox) div[class*=divider] {\n  display: none;\n}\n.danho-form-group__checkbox {\n  margin: 0;\n}\n.danho-form-group input,\n.danho-form-group select,\n.danho-form-group textarea {\n  background-color: var(--primary-700);\n  border-color: var(--input-border);\n  border-radius: 0.25rem;\n}\n.danho-form-group input::placeholder,\n.danho-form-group select::placeholder,\n.danho-form-group textarea::placeholder {\n  color: var(--input-placeholder-text);\n}\n.danho-form-group input:focus-visible,\n.danho-form-group select:focus-visible,\n.danho-form-group textarea:focus-visible {\n  color: var(--interactive-active);\n}\n.danho-form-group input:hover,\n.danho-form-group select:hover,\n.danho-form-group textarea:hover {\n  color: var(--interactive-hover);\n}\n\n.input-container {\n  display: flex;\n  align-items: center;\n  gap: 0.5ch;\n  position: relative;\n}\n\n.danho-plugin-settings {\n  display: grid;\n  gap: 1rem;\n}\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.hidden {\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container,\n.button-panel {\n  display: flex;\n  align-items: center;\n  justify-content: end;\n}\n.button-container button,\n.button-panel button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input,\n.button-panel .text-input-container input {\n  padding: 7px;\n}\n\n.clickable {\n  cursor: pointer;\n}\n\n.bd-modal-root {\n  max-height: 90vh !important;\n}\n\n.border-success {\n  border: 1px solid var(--button-positive-background);\n}\n\n.bdd-wrapper:has(#secret-channel-login) {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  background-color: var(--background-secondary);\n  height: 100%;\n  width: 100%;\n  z-index: 10;\n}\n\n#secret-channel-login {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n}\n\ndiv:has(> #secret-channel-login) {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.locked-channels-settings-list .guild-list-item {\n  display: grid;\n  grid-template-columns: 4rem 1fr;\n  align-items: start;\n  gap: 1ch;\n}\n.locked-channels-settings-list .guild-list-item__icon {\n  --size: 4rem;\n}\n.locked-channels-settings-list .guild-list-item__content-container {\n  gap: 1ch;\n}\n.locked-channels-settings-list .collapsible {\n  margin: 0;\n}\n.locked-channels-settings-list .searchable-list__items {\n  --min: 100%;\n}\n.locked-channels-settings-list .lock-channel-form {\n  max-width: calc(100% - 2rem);\n}";

const index = createPlugin({
    start() {
        patch();
        subscribeToActions();
        loadStores();
        if (LockedChannelsStore.isLocked(ChannelUtils.currentChannelId)) {
            ActionsEmitter.emit('LOCK_CHANNEL', { channelId: ChannelUtils.currentChannelId });
        }
    },
    stop() {
        ActionsEmitter.removeAllListeners();
    },
    styles,
    Settings,
    SettingsPanel,
});

module.exports = index;

/*@end @*/
