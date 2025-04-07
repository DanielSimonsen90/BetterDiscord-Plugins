/**
 * @name 0DanhoLibrary
 * @version 2.3.0
 * @author danielsimonsen90
 * @authorLink https://github.com/danielsimonsen90
 * @description Library for Danho's plugins
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/0DanhoLibrary
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
  "name": "0danho-library",
  "description": "Library for Danho's plugins",
  "author": "danielsimonsen90",
  "version": "2.3.0",
  "development": true,
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

const Filters = {
    __proto__: null,
    byEntry,
    byKeys: byKeys$1,
    byName: byName$1,
    byProtos: byProtos$1,
    bySource: bySource$1,
    checkObjectValues,
    join: join$1,
    query: query$1
};

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
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

const find$2 = (filter, { resolve = true, entries = false } = {}) => BdApi.Webpack.getModule(filter, {
    defaultExport: resolve,
    searchExports: entries
});
const query = (query, options) => find$2(query$1(query), options);
const byEntries = (...filters) => find$2(join$1(...filters.map((filter) => byEntry(filter))));
const byName = (name, options) => find$2(byName$1(name), options);
const byKeys = (keys, options) => find$2(byKeys$1(...keys), options);
const byProtos = (protos, options) => find$2(byProtos$1(...protos), options);
const bySource = (contents, options) => find$2(bySource$1(...contents), options);
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
const findWithKey = (filter) => resolveKey(find$2(byEntry(filter)), filter);
const demangle = (mapping, required, proxy = false) => {
    const req = required ?? Object.keys(mapping);
    const found = find$2((target) => (checkObjectValues(target)
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
    find: find$2,
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
const contextMenu = (navId, callback, options = {}) => {
    const cancel = BdApi.ContextMenu.patch(navId, options.once ? (tree) => {
        const result = callback(tree);
        cancel();
        return result;
    } : callback);
    menuPatches.push(cancel);
    if (!options.silent) {
        log(`Patched ${options.name ?? `"${navId}"`} context menu`);
    }
    return cancel;
};
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
    return findModule$1("string", JSON.stringify(strings), m => checkModuleStrings(m, strings) && m, config);
}
function checkModuleStrings(module, strings, config = {}) {
    const check = (s1, s2) => {
        s1 = config.ignoreCase ? s1.toString().toLowerCase() : s1.toString();
        return config.hasNot ? s1.indexOf(s2) == -1 : s1.indexOf(s2) > -1;
    };
    return [strings].flat(10).filter(n => typeof n == "string").map(config.ignoreCase ? (n => n.toLowerCase()) : (n => n)).every(string => module && ((typeof module == "function" || typeof module == "string") && (check(module, string) || typeof module.__originalFunction == "function" && check(module.__originalFunction, string)) || typeof module.type == "function" && check(module.type, string) || (typeof module == "function" || typeof module == "object") && module.prototype && Object.keys(module.prototype).filter(n => n.indexOf("render") == 0).some(n => check(module.prototype[n], string))));
}
function findModule$1(type, cacheString, filter, config = {}) {
    if (!isObject(Cache.modules[type]))
        Cache.modules[type] = { module: {}, export: {} };
    let defaultExport = typeof config.defaultExport != "boolean" ? true : config.defaultExport;
    if (!config.all && defaultExport && Cache.modules[type].export[cacheString])
        return Cache.modules[type].export[cacheString];
    else if (!config.all && !defaultExport && Cache.modules[type].module[cacheString])
        return Cache.modules[type].module[cacheString];
    else {
        let m = find$1(filter, config);
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
function find$1(filter, config = {}) {
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

const Finder$1 = {
    __proto__: null,
    BDFDB_findByStrings,
    Finder,
    abort,
    all,
    byEntries,
    byKeys,
    byName,
    byProtos,
    bySource,
    get controller () { return controller; },
    default: Finder,
    demangle,
    find: find$2,
    findBySourceStrings,
    findComponentBySourceStrings,
    findModuleById,
    findUnpatchedModuleBySourceStrings,
    findWithKey,
    query,
    resolveKey,
    waitFor
};

const ApplicationStore = Finder.byName("ApplicationStore");

const Dispatcher$1 = /* @__PURE__ */ byKeys(["dispatch", "subscribe"]);

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$1("Store", "connectStores"),
    Dispatcher: byProtos$1("dispatch"),
    Store: byProtos$1("emitChange"),
    BatchedStoreListener: byProtos$1("attach", "detach"),
    useStateFromStores: bySource$1("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);

const SortedGuildStore$1 = /* @__PURE__ */ byName("SortedGuildStore");
const ExpandedGuildFolderStore = /* @__PURE__ */ byName("ExpandedGuildFolderStore");

const { React } = BdApi;
const { ReactDOM } = BdApi;
const classNames$1 = /* @__PURE__ */ find$2((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const EventEmitter = /* @__PURE__ */ find$2((exports) => exports.prototype instanceof Object && Object.prototype.hasOwnProperty.call(exports.prototype, "prependOnceListener"));

const UserStore$1 = /* @__PURE__ */ byName("UserStore");
const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const Button$1 = /* @__PURE__ */ byKeys(["Colors", "Link"], { entries: true });

const Clickable = /* @__PURE__ */ bySource(["ignoreKeyPress:"], { entries: true });

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

const FormElements = {
    __proto__: null,
    FormDivider,
    FormItem: FormItem$1,
    FormNotice,
    FormSection,
    FormSwitch,
    FormText,
    FormTitle
};

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

const { Menu, Group: MenuGroup, Item: MenuItem, Separator: MenuSeparator, CheckboxItem: MenuCheckboxItem, RadioItem: MenuRadioItem, ControlItem: MenuControlItem } = BdApi.ContextMenu;

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

const QuickSwitcherStore = byName("QuickSwitcherStore");

const ThemeStore = byKeys(["theme"]);

const ChannelListStore = byName('ChannelListStore');

const ChannelMemberStore = byName('ChannelMemberStore');

const ChannelStatusStore = Finder.byName("ChannelStatusStore");

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

const ReadStateStore = Finder.byName("ReadStateStore");

const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const GuildEmojiStore = byKeys(["getEmojis"]);

const GuildMemberStore = byName("GuildMemberStore");

const GuildStore = byName("GuildStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const SortedGuildStore = SortedGuildStore$1;

const UserGuildSettingsStore = byName("UserGuildSettingsStore");

const MessageStore = byName("MessageStore");

const MessageRequestStore = byName("MessageRequestStore");

const SpamMessageRequestStore = byName("SpamMessageRequestStore");

const PresenceStore = /* @__PURE__ */ byName("PresenceStore");

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

const UserProfileStore = byName("UserProfileStore");

const UserSettingsAccountStore = byName("UserSettingsAccountStore");
const UserProfileSettingsStore = byKeys(["saveProfileChanges", "setPendingBio"]);
const BetterProfileSettings = {
    ...byKeys(["saveProfileChanges", "setPendingBio"]),
    ...byName("UserSettingsAccountStore")
};
var FormStates;
(function (FormStates) {
    FormStates["OPEN"] = "OPEN";
    FormStates["SUBMITTING"] = "SUBMITTING";
    FormStates["CLOSED"] = "CLOSED";
})(FormStates || (FormStates = {}));

const UserStore = Finder.byName("UserStore");

const UserTypingStore = byKeys(["getTypingUsers", "isTyping"]);

const ContentInventoryStore = byName("ContentInventoryStore");

const getEmojiUrl = (emoji, size = 128) => (`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}` +
    `?size=${size}&qualiy=lossless`);
const EmojiStore = byName("EmojiStore");

const MediaEngineStore = byKeys(["isSelfMute", "isNoiseCancellationSupported"]);
const MediaEngine = MediaEngineStore.getMediaEngine();
const VideoComponent = MediaEngineStore.getVideoComponent();
const CameraComponent = MediaEngineStore.getCameraComponent();
var MediaEngineContextTypes;
(function (MediaEngineContextTypes) {
    MediaEngineContextTypes["DEFAULT"] = "default";
    MediaEngineContextTypes["STREAM"] = "stream";
})(MediaEngineContextTypes || (MediaEngineContextTypes = {}));
var MediaEngineEvent;
(function (MediaEngineEvent) {
    MediaEngineEvent[MediaEngineEvent["VoiceActivity"] = 0] = "VoiceActivity";
    MediaEngineEvent[MediaEngineEvent["DeviceChange"] = 1] = "DeviceChange";
    MediaEngineEvent[MediaEngineEvent["VideoInputInitialized"] = 2] = "VideoInputInitialized";
})(MediaEngineEvent || (MediaEngineEvent = {}));
var AudioSubSystems;
(function (AudioSubSystems) {
    AudioSubSystems[AudioSubSystems["LEGACY"] = 0] = "LEGACY";
})(AudioSubSystems || (AudioSubSystems = {}));
var SupportedFeatures;
(function (SupportedFeatures) {
    SupportedFeatures[SupportedFeatures["LEGACY_AUDIO_SUBSYSTEM"] = 0] = "LEGACY_AUDIO_SUBSYSTEM";
    SupportedFeatures[SupportedFeatures["EXPERIMENTAL_AUDIO_SUBSYSTEM"] = 1] = "EXPERIMENTAL_AUDIO_SUBSYSTEM";
    SupportedFeatures[SupportedFeatures["DEBUG_LOGGING"] = 2] = "DEBUG_LOGGING";
    SupportedFeatures[SupportedFeatures["SOUNDSHARE"] = 3] = "SOUNDSHARE";
    SupportedFeatures[SupportedFeatures["ELEVATED_HOOK"] = 4] = "ELEVATED_HOOK";
    SupportedFeatures[SupportedFeatures["LOOPBACK"] = 5] = "LOOPBACK";
    SupportedFeatures[SupportedFeatures["WUMPUS_VIDEO"] = 6] = "WUMPUS_VIDEO";
    SupportedFeatures[SupportedFeatures["HYBRID_VIDEO"] = 7] = "HYBRID_VIDEO";
    SupportedFeatures[SupportedFeatures["ATTENUATION"] = 8] = "ATTENUATION";
    SupportedFeatures[SupportedFeatures["VIDEO_HOOK"] = 9] = "VIDEO_HOOK";
    SupportedFeatures[SupportedFeatures["GRAPHICS_CAPTURE"] = 10] = "GRAPHICS_CAPTURE";
    SupportedFeatures[SupportedFeatures["EXPERIMENTAL_SOUNDSHARE"] = 11] = "EXPERIMENTAL_SOUNDSHARE";
    SupportedFeatures[SupportedFeatures["OPEN_H246"] = 12] = "OPEN_H246";
    SupportedFeatures[SupportedFeatures["REMOVE_LOCUS_NETWORK_CONTROL"] = 13] = "REMOVE_LOCUS_NETWORK_CONTROL";
    SupportedFeatures[SupportedFeatures["SCREEN_PREVIEWS"] = 14] = "SCREEN_PREVIEWS";
    SupportedFeatures[SupportedFeatures["AUDIO_DEBUG_STATE"] = 15] = "AUDIO_DEBUG_STATE";
    SupportedFeatures[SupportedFeatures["CONNECTION_REPLAY"] = 16] = "CONNECTION_REPLAY";
    SupportedFeatures[SupportedFeatures["SIMULCAST"] = 17] = "SIMULCAST";
    SupportedFeatures[SupportedFeatures["RTC_REGION_RANKING"] = 18] = "RTC_REGION_RANKING";
    SupportedFeatures[SupportedFeatures["DIRECT_VIDEO"] = 19] = "DIRECT_VIDEO";
    SupportedFeatures[SupportedFeatures["ELECTRON_VIDEO"] = 20] = "ELECTRON_VIDEO";
    SupportedFeatures[SupportedFeatures["MEDIAPIPE"] = 21] = "MEDIAPIPE";
    SupportedFeatures[SupportedFeatures["FIXED_KEYFRAME_INTERVAL"] = 22] = "FIXED_KEYFRAME_INTERVAL";
    SupportedFeatures[SupportedFeatures["DIAGNOSTICS"] = 23] = "DIAGNOSTICS";
    SupportedFeatures[SupportedFeatures["NATIVE_PING"] = 24] = "NATIVE_PING";
    SupportedFeatures[SupportedFeatures["AUTOMATIC_VAD"] = 25] = "AUTOMATIC_VAD";
    SupportedFeatures[SupportedFeatures["AUDIO_INPUT_DEVICE"] = 26] = "AUDIO_INPUT_DEVICE";
    SupportedFeatures[SupportedFeatures["AUDIO_OUTPUT_DEVICE"] = 27] = "AUDIO_OUTPUT_DEVICE";
    SupportedFeatures[SupportedFeatures["QOS"] = 28] = "QOS";
    SupportedFeatures[SupportedFeatures["VOICE_PROCESSING"] = 29] = "VOICE_PROCESSING";
    SupportedFeatures[SupportedFeatures["AUTO_ENABLE"] = 30] = "AUTO_ENABLE";
    SupportedFeatures[SupportedFeatures["VIDEO"] = 31] = "VIDEO";
    SupportedFeatures[SupportedFeatures["DESKTOP_CAPTURE"] = 32] = "DESKTOP_CAPTURE";
    SupportedFeatures[SupportedFeatures["DESKTOP_CAPTURE_FORMAT"] = 33] = "DESKTOP_CAPTURE_FORMAT";
    SupportedFeatures[SupportedFeatures["DESKTOP_CAPTURE_APPLICATIONS"] = 34] = "DESKTOP_CAPTURE_APPLICATIONS";
    SupportedFeatures[SupportedFeatures["VOICE_PANNING"] = 35] = "VOICE_PANNING";
    SupportedFeatures[SupportedFeatures["AEC_DUMP"] = 36] = "AEC_DUMP";
    SupportedFeatures[SupportedFeatures["DISABLE_VIDEO"] = 37] = "DISABLE_VIDEO";
    SupportedFeatures[SupportedFeatures["SAMPLE_PLAYBACK"] = 38] = "SAMPLE_PLAYBACK";
})(SupportedFeatures || (SupportedFeatures = {}));

const RTCConnectionStore = byName("RTCConnectionStore");

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
const createDiumStore = (defaults, dataKey, onLoad) => new DiumStore(defaults, dataKey, onLoad);
function formatStoreName(name) {
    const pascal = name.charAt(0).toUpperCase() + name.slice(1);
    return name.endsWith('Store')
        ? pascal
        : `${pascal}Store`;
}

const DiscordStores = (() => (Array.from(BdApi.Webpack
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
function findStore(storeName, allowMultiple = false) {
    const result = Object.values(Finder.byName("UserSettingsAccountStore")
        ._dispatcher._actionHandlers._dependencyGraph.nodes).sort((a, b) => a.name.localeCompare(b.name))
        .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));
    return allowMultiple
        ? result.map(store => [store.name, Finder.byName(store.name) ?? new class InvalidStore {
                constructor() {
                    this.node = store;
                }
            }])
        : result.map(store => Finder.byName(store.name)
            ?? new class InvalidStore {
                constructor() {
                    this.node = store;
                }
                getName() { return store.name; }
            })[0];
}
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

const Stores = {
    __proto__: null,
    ApplicationStore,
    get AudioSubSystems () { return AudioSubSystems; },
    BetterProfileSettings,
    CameraComponent,
    ChannelListStore,
    ChannelMemberStore,
    ChannelStatusStore,
    ChannelStore,
    ContentInventoryStore,
    DanhoStores,
    DiscordStores,
    DiumStore,
    EmojiStore,
    ExpandedGuildFolderStore,
    GuildChannelStore,
    GuildEmojiStore,
    GuildMemberStore,
    GuildStore,
    MediaEngine,
    get MediaEngineContextTypes () { return MediaEngineContextTypes; },
    get MediaEngineEvent () { return MediaEngineEvent; },
    MediaEngineStore,
    MessageRequestStore,
    MessageStore,
    PresenceStore,
    QuickSwitcherStore,
    RTCConnectionStore,
    ReadStateStore,
    RelationshipStore,
    SelectedChannelStore,
    SelectedGuildStore,
    SortedGuildStore,
    SpamMessageRequestStore,
    get SupportedFeatures () { return SupportedFeatures; },
    ThemeStore,
    UserActivityStore,
    UserGuildSettingsStore,
    UserMentionStore,
    UserNoteStore,
    UserProfileSettingsStore,
    UserProfileStore,
    UserSettingsAccountStore,
    UserStore,
    UserTypingStore,
    VideoComponent,
    VoiceStore,
    createDiumStore,
    findStore,
    getEmojiUrl
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

const wait = (callback, time) => new Promise((resolve, reject) => {
    try {
        setTimeout(() => resolve(callback()), time);
    }
    catch (err) {
        reject(err);
    }
});

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
    join, kebabCaseFromCamelCase, pascalCaseFromSnakeCase, pascalCaseFromCamelCase,
    generateRandomId,
};

const UrlUtils = {
    badgeIcon(icon) {
        return `https://cdn.discordapp.com/badge-icons/${icon}.png`;
    }
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
    timeSpan,
    throttle,
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

const GuildActions = byKeys(["requestMembers"]);

const UserNoteActions = byKeys(["updateNote"]);

const createActionCallback = (action, callback) => {
    return callback;
};

const navigate = Finder.findBySourceStrings("transitionTo -", { defaultExport: false, searchExports: true });
const navigateToGuild = Finder.findBySourceStrings("transitionToGuild -", { defaultExport: false, searchExports: true });
const AppActions = {
    navigate,
    navigateToGuild,
};

const ApplicationActions = Finder.findBySourceStrings("fetchApplications", "createApplication");

const ChannelActions = byKeys(["selectChannel"]);

const MessageActions = byKeys(["sendMessage"]);

const PermissionActions = Finder.findBySourceStrings("addRecipient", "clearPermissionOverwrite", "updatePermissionOverwrite", "backupId=493683");

const dispatch = Finder.findBySourceStrings('getStatus()', 'updateAsync("status",');
const UserStatusActions = {
    dispatch,
};

const InternalVoiceActions = Finder.findBySourceStrings("setVideoEnabled", "setVideoDevice");
const handleVoiceConnect = Finder.findBySourceStrings("handleVoiceConnect");
const ChannelSettingsActions = Finder.byKeys(["open", "saveChannel", "updateVoiceChannelStatus"]);
const StageChannelActions = Finder.byKeys(["updateChatOpen"]);
const VoiceActions = Object.assign({}, InternalVoiceActions, ChannelSettingsActions, StageChannelActions, {
    handleVoiceConnect
});

const DISPATCH_ACTIONS = (() => {
    const actions = new Set();
    Object.values(Dispatcher$1._actionHandlers._dependencyGraph.nodes)
        .forEach(node => Object.keys(node.actionHandler)
        .forEach(event => actions.add(event)));
    Object.keys(Dispatcher$1._subscriptions).forEach(event => actions.add(event));
    return [...actions].sort((a, b) => a.localeCompare(b));
})();
function find(action) {
    return DISPATCH_ACTIONS.filter(key => key.toLowerCase().includes(action.toLowerCase()));
}
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
        const action = args.shift();
        if (args.length)
            Logger.warn(`The following arguments were not used:`, { args });
        const payload = Object.assign({ type: eventName }, action);
        Logger.log(`[ActionsEmitter] Dispatching ${eventName}`, { payload });
        Dispatcher$1.dispatch(payload);
        return super.emit(eventName, ...args);
    }
};

const Actions = {
    __proto__: null,
    ActionsEmitter,
    AppActions,
    ApplicationActions,
    ChannelActions,
    DISPATCH_ACTIONS,
    GuildActions,
    MessageActions,
    PermissionActions,
    UserNoteActions,
    UserStatusActions,
    VoiceActions,
    createActionCallback,
    dispatch,
    find
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
            type: 'USER_PROFILE_MODAL_OPEN',
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
    }
};

function findNodeByIncludingClassName(className, node = document.body) {
    return node.querySelector(`[class*="${className}"]`);
}
function findModule(args, returnDisplayNamesOnly = false) {
    const module = typeof args === 'string' ? query({ name: args }) : query({ keys: args });
    if (!module)
        return module;
    return returnDisplayNamesOnly ?
        Array.isArray(module) ?
            module.map(m => m.default?.displayName || m.displayName) :
            module.default?.displayName || module.displayName
        : module;
}
function currentUser() {
    return UserStore.getCurrentUser();
}
function currentGuild() {
    const guildId = SelectedGuildStore.getGuildId();
    return guildId ? GuildStore.getGuild(guildId) : null;
}
function currentChannel() {
    const channelId = SelectedChannelStore.getChannelId();
    return channelId ? ChannelStore.getChannel(channelId) : null;
}
function currentGuildMembers() {
    const guildId = currentGuild()?.id;
    return guildId ? GuildMemberStore.getMembers(guildId) : null;
}
const Utils = {
    findNodeByIncludingClassName,
    findModule,
    get currentGuild() { return currentGuild(); },
    get currentChannel() { return currentChannel(); },
    get currentGuildMembers() { return currentGuildMembers(); },
    get currentUser() { return currentUser(); },
    StringUtils, ObjectUtils, UrlUtils, TimeUtils,
    ClassNamesUtils, ContextMenuUtils,
    ChannelUtils, GuildUtils, UserUtils,
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
async function $p(selector, single = true) {
    const resolved = await selector(new ElementSelector(), $);
    if (single)
        return new DQuery(resolved);
    let elements = (() => {
        if (resolved instanceof ElementSelector || typeof resolved === 'string')
            return [...document.querySelectorAll(resolved.toString()).values()];
        else if (resolved instanceof DQuery) {
            return [resolved.element];
        }
        return (Array.isArray(resolved) ? resolved : [resolved]);
    })();
    return elements.map(el => new DQuery(el));
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
    if (!target)
        return element;
    if (target instanceof Node)
        return target.appendChild(element);
    else if (target instanceof DQuery)
        return target.element.appendChild(element);
    else if (typeof target === "string" || target instanceof ElementSelector || typeof target === 'function')
        return document.querySelector(typeof target === 'function' ? target(new ElementSelector(), $).toString() : target.toString()).appendChild(element);
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

function observeAppMountFor(callback, timeout, rejectMessage) {
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!mutation.addedNodes.length)
                    return;
                const result = callback();
                if (result) {
                    observer.disconnect();
                    resolve(result);
                }
            });
        });
        observer.observe(document.querySelector('#app-mount'), { childList: true, subtree: true });
        if (timeout)
            setTimeout(() => reject(rejectMessage ?? 'Timeout'), timeout);
    });
}

const DOM = {
    __proto__: null,
    $,
    $p,
    DQuery,
    addEventListener,
    createElement: createElement$1,
    injectElement,
    observeAppMountFor,
    removeAllEventListeners,
    removeAllInjections
};

const styles$3 = ".collapsible {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 1px solid var(--primary-500);\n  border-radius: 4px;\n  overflow: hidden;\n  margin: 1rem 0;\n}\n.collapsible__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 1rem;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.collapsible__header > span::after {\n  content: \"\";\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid var(--interactive-muted);\n  margin-left: 0.5rem;\n}\n.collapsible__header > span::after:hover {\n  border-top-color: var(--interactive-hover);\n}\n.collapsible__content {\n  padding: 0.5rem 1rem;\n  background-color: var(--background-secondary);\n  border-top: 1px solid var(--primary-500);\n}\n.collapsible__content.hidden {\n  display: none;\n}\n.collapsible[data-open=true] > .collapsible__header > span::after {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid var(--interactive-normal);\n}\n.collapsible[data-disabled=true] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.guild-list-item {\n  display: flex;\n  flex-direction: row;\n  font-size: 24px;\n  align-items: center;\n}\n.guild-list-item__icon {\n  --size: 2rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  margin-right: 1ch;\n}\n.guild-list-item__content-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 1rem;\n}\n.guild-list-item__name {\n  font-weight: bold;\n  color: var(--text-primary);\n}\n.guild-list-item__content {\n  color: var(--text-tertiary);\n}\n\n.custom-message {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 0.5ch;\n}\n.custom-message__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n}\n.custom-message__main {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5ch;\n}\n.custom-message__main header {\n  display: flex;\n  align-items: center;\n  gap: 0.5ch;\n}\n.custom-message .user-mention, .custom-message .role-mention {\n  color: var(--mention-foreground);\n  background-color: var(--mention-background);\n}\n.custom-message .user-mention::before, .custom-message .role-mention::before {\n  content: \"@\";\n}\n.custom-message .channel-mention::before {\n  content: \"#\";\n}\n.custom-message .custom-message__attachments img {\n  max-height: 100%;\n  max-width: 100%;\n}\n\n.progress-bar {\n  width: 100%;\n  height: 0.5rem;\n  border-radius: 0.5rem;\n  overflow: hidden;\n}\n.progress-bar__fill {\n  height: 100%;\n  background-color: var(--primary-600);\n  transition: width 0.3s;\n}\n\n.searchable-list {\n  display: grid;\n}\n.searchable-list__input-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5ch;\n  position: sticky;\n  top: 0;\n}\n.searchable-list__input {\n  height: 100%;\n  width: 100%;\n  padding: 0.25rem 0.5rem;\n  border: 1px solid var(--primary-460);\n  background-color: var(--primary-500);\n  color: var(--text-normal);\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  border-radius: 0.25rem;\n}\n.searchable-list__input:focus {\n  outline: none;\n  border-color: var(--primary-360);\n}\n.searchable-list__items {\n  --min: 10rem;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(var(--min), 1fr));\n  gap: 1rem;\n}\n.searchable-list__item {\n  overflow: hidden;\n}\n\n.tab-bar {\n  max-width: 100%;\n}\n.tab-bar * {\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n\n.tab-bar__tabs {\n  display: grid;\n  grid-auto-flow: column;\n  max-width: 100%;\n  overflow: auto hidden;\n}\n.tab-bar__tabs--no-color .tab-bar__tab {\n  background-color: transparent;\n  border: none;\n}\n\n.tab-bar__tab {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border: none;\n  background-color: var(--primary-630);\n  color: var(--text-muted);\n  border: 1px solid var(--border-faint);\n  padding: 0.3rem 1rem;\n}\n.tab-bar__tab:hover {\n  background-color: var(--primary-600);\n  color: var(--text-primary);\n}\n.tab-bar__tab--active {\n  border: 1px solid var(--border-faint);\n  border-bottom: 1px solid var(--text-primary) !important;\n  color: var(--text-primary);\n}\n\n.tab-bar__content {\n  padding: 1em;\n  background-color: var(--primary-630);\n  border: 1px solid var(--border-faint);\n}\n.tab-bar__content--no-color {\n  background-color: transparent;\n  border: none;\n}\n.tab-bar__content-page:not(.tab-bar__content-page--active) {\n  opacity: 0;\n  z-index: -1;\n  pointer-events: none;\n  height: 0;\n}\n\n.danho-discord-user {\n  display: flex;\n  align-items: center;\n  gap: 1ch;\n  margin: 0.5rem 0;\n}\n.danho-discord-user__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n  aspect-ratio: 1/1;\n}\n.danho-discord-user__user-info {\n  display: grid;\n}\n.danho-discord-user__displayName {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.danho-discord-user__username {\n  color: var(--text-normal);\n}\n\n.danho-form-switch {\n  display: flex;\n  flex-direction: row-reverse;\n  align-items: center;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-form-select,\n.setting-group {\n  display: flex;\n  flex-direction: column-reverse;\n  gap: 0.5rem;\n  margin-top: 1rem;\n}\n\n.danho-form-group {\n  display: grid;\n  gap: 0.5ch;\n  margin-bottom: 1em;\n}\n.danho-form-group:has(.danho-form-group__checkbox) {\n  grid-template-columns: auto 1fr;\n  align-items: center;\n}\n.danho-form-group:has(.danho-form-group__checkbox) div[class*=divider] {\n  display: none;\n}\n.danho-form-group__checkbox {\n  margin: 0;\n}\n.danho-form-group input,\n.danho-form-group select,\n.danho-form-group textarea {\n  background-color: var(--input-background);\n  border-color: var(--input-border);\n  border-radius: 0.25rem;\n}\n.danho-form-group input::placeholder,\n.danho-form-group select::placeholder,\n.danho-form-group textarea::placeholder {\n  color: var(--input-placeholder-text);\n}\n.danho-form-group input:focus-visible,\n.danho-form-group select:focus-visible,\n.danho-form-group textarea:focus-visible {\n  color: var(--interactive-active);\n}\n.danho-form-group input:hover,\n.danho-form-group select:hover,\n.danho-form-group textarea:hover {\n  color: var(--interactive-hover);\n}\n\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.hidden {\n  opacity: 0;\n  height: 0;\n  width: 0;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}\n\n.clickable {\n  cursor: pointer;\n}\n\n.bd-modal-root {\n  max-height: 90vh !important;\n}\n\n.border-success {\n  border: 1px solid var(--button-positive-background);\n}";

class DanhoLibrary {
    constructor() {
        this.Utils = Utils;
        this.Users = UserUtils;
        this.Guilds = GuildUtils;
        this.DOM = DOM;
        this.Stores = Stores;
        this.Actions = Actions;
        this.Finder = Finder$1;
        this.Filters = Filters;
        this.styles = styles$3;
    }
}
const LibraryPlugin = new DanhoLibrary();
window.DL = LibraryPlugin;
window.Finder = Finder$1;
function buildPlugin(plugin) {
    const built = Object.assign({}, LibraryPlugin, plugin);
    built.styles = [LibraryPlugin.styles, plugin.styles].join('\n\n');
    return createPlugin(built);
}

const USER_TAGS = {
    DANHO: 'danhosaur',
    THEGUNASS: 'thegunass',
    BEAUTYKILLER: 'thebeautykiller',
    EMILIE: 'emi.2008',
    CARL: 'carlbradsted',
    MIZBATT: 'mizbatt',
};
const DEFAULT_DISCORD_ROLE_COLOR = `153, 170, 181`;

const StyleChanges$1 = {
    styleChanges: true,
    movePremiumBadge: true,
    prettyRoles: true,
    defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
    groupRoles: true,
    pronounsPageLinks: true,
    expandBioAgain: true,
    nonObnoxiousProfileEffects: true,
    uiReworkFix: true,
    removePrivateSearchButton: true,
    groupPrivateChannelNavOptions: true,
};
const DiscordEnhancements$1 = {
    discordEnhancements: true,
    autoCancelFriendRequests: true,
    folderNames: new Array(),
    joinVoiceWithCamera: true,
    showGuildMembersInHeader: true,
    allowForumSortByAuthor: true,
    showUserTimezone: true,
    hideTimezoneIcon: false,
    hideTimezoneTimestamp: false,
    showUserBirthdate: true,
    hideBirthdateIcon: false,
    hideBirthdateTimestamp: false,
    birthdateTimestampStyle: 'd',
    showBirthdayCalendar: true,
    showBirthdayOnNameTag: true,
    betterQuickSwitcher: true,
    expandActivityStatus: true,
    hideChannelUntilActivity: true,
    keepChannelVisibleAfterActivityTimeoutMin: 5,
    directAndGroupTabs: true,
    defaultDirectAndGroupTab: 'direct',
};
const DanhoEnhancements$1 = {
    danhoEnhancements: true,
    badges: true,
    useClientCustomBadges: true,
    wakeUp: true,
    isHidingOnPurpose: false,
    addToDungeon: true,
    lockChannels: true,
    lockPassword: 'hello',
    lockUnlockForMinutes: 5,
    initialLockState: true,
};
const Settings = createSettings({
    ...StyleChanges$1,
    ...DiscordEnhancements$1,
    ...DanhoEnhancements$1,
});
const StyleChangesTitles = {
    styleChanges: `Style changes`,
    movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,
    prettyRoles: `Remove role circle, add more color to the roles`,
    defaultRoleColor: `Default role color`,
    groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,
    pronounsPageLinks: `Turn pronouns.page links into clickable links`,
    expandBioAgain: `Expand the bio section again by default`,
    nonObnoxiousProfileEffects: `Lower the opacity of profile effects (on hover) so they aren't as obnoxious`,
    uiReworkFix: `Fix some of the Discord UI rework discomfort`,
    removePrivateSearchButton: `Remove the search button in the private channel sidebar`,
    groupPrivateChannelNavOptions: `Group navigation options (friends, nitro, shop) in the private channel sidebar`,
};
const DiscordEnhancementsTitles = {
    discordEnhancements: `Discord enhancements`,
    autoCancelFriendRequests: `Auto cancel friend requests on bigger servers`,
    folderNames: `Folder names that should block all incoming friend requests`,
    joinVoiceWithCamera: `Join voice channels with camera on`,
    showGuildMembersInHeader: `Show guild members in the header`,
    allowForumSortByAuthor: `Allow sorting forum posts by author`,
    showUserTimezone: `Show user's timezone in the user popout/profile`,
    hideTimezoneIcon: `Hide the timezone icon`,
    hideTimezoneTimestamp: `Hide the timezone timestamp`,
    showUserBirthdate: `Show user's birthdate in the user popout/profile`,
    hideBirthdateIcon: `Hide the birthdate icon`,
    hideBirthdateTimestamp: `Hide the birthdate timestamp`,
    birthdateTimestampStyle: `Birthdate timestamp style`,
    showBirthdayCalendar: `Show birthday calendar in global navigation`,
    showBirthdayOnNameTag: `Show birthday on name tag`,
    betterQuickSwitcher: `Better quickswitcher prioritizing friends and top guilds`,
    expandActivityStatus: `Expand activity status to show more information i.e. what a user is listening to`,
    hideChannelUntilActivity: `Hide channels from your channel list until they have activity`,
    keepChannelVisibleAfterActivityTimeoutMin: `Keep recently active hidden channel visible for x minutes`,
    directAndGroupTabs: `Add a tab bar to distinguish between direct messages and group chats`,
    defaultDirectAndGroupTab: `Default tab to open`,
};
const DanhoEnhancementsTitles = {
    danhoEnhancements: `Danho enhancements`,
    badges: `User badge modifications`,
    useClientCustomBadges: `Use your own custom badges`,
    wakeUp: `Reminds you that you're hiding. Why are you hiding?`,
    isHidingOnPurpose: `User confirmed that they're hiding on purpose`,
    addToDungeon: `"Add to / Remove from Dungeon" context menu on users in the Deadly Ninja server`,
    lockChannels: `Lock channels with a password`,
    lockPassword: `Password for locking channels`,
    lockUnlockForMinutes: `Minutes to lock channels for`,
    initialLockState: `Initial lock state for channels`,
};
const titles = {
    ...StyleChangesTitles,
    ...DiscordEnhancementsTitles,
    ...DanhoEnhancementsTitles,
};

const { useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useId, useDeferredValue, useInsertionEffect, useSyncExternalStore, useTransition, createRef, createContext, createElement, createFactory, forwardRef, cloneElement, lazy, memo, isValidElement, Component, PureComponent, Fragment, Suspense, } = React;

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, errorInfo) {
        Logger.error('ErrorBoundary caught an error', { error, errorInfo });
    }
    render() {
        if (this.state.error) {
            const { message, stack } = this.state.error;
            const title = this.props.id ? `Error in ${this.props.id}` : 'Error';
            return (React.createElement("div", { className: "error-boundary" },
                React.createElement(Text, { variant: 'heading-lg/bold' }, title),
                React.createElement(Text, { variant: 'text-md/normal' }, message),
                React.createElement(Text, { variant: 'text-sm/normal' }, stack)));
        }
        return this.props.children;
    }
}

const renderChildren = (children, props = {}) => children.map(child => React.createElement(child.tagName, Array.from(child.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), props), child.outerHTML.match(/</g).length > 2 ? renderChildren(Array.from(child.children)) : child.textContent));
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

function useForceUpdate() {
    const [, setState] = useState(0);
    return useCallback(() => setState((prev) => prev + 1), []);
}

const InputModule = ClassNamesUtils.combineModuleByKeys(['inputWrapper', 'inputDefault'], ['dividerDefault', 'title']);
function FormItem(props) {
    const { value, label, type } = props;
    return React.createElement(FormGroup, { ...props, name: label, inputType: type ?? getInputType(value) });
}
function FormItemFromModel(props) {
    const { model, property } = props;
    const onModelChange = 'onModelChange' in props ? props.onModelChange : (m, p, v) => { };
    const onChange = 'onChange' in props ? props.onChange : (v) => { };
    const { label, value } = props;
    return React.createElement(FormGroup, { ...props, name: property, label: label ?? StringUtils.pascalCaseFromCamelCase(property), inputType: props.type ?? getInputType(value ?? model[property]), value: value ?? model[property], onChange: (v) => {
            onModelChange(model, property, v);
            onChange(v);
        } });
}
function FormGroup(props) {
    const [internal, setInternal] = useState(props.value);
    const debounceChange = useDebounceCallback((value) => props.onChange(value), props.debounce);
    const onChange = useCallback((newValue) => {
        setInternal(newValue);
        if (props.debounce)
            debounceChange(newValue);
        else
            props.onChange(newValue);
    }, [props.debounce, props.onChange, props.inputType, props.value]);
    const className = classNames("danho-form-group__input", `danho-form-group__${props.inputType}`, props.required && `danho-form-group__${props.inputType}--required`, props.disabled && InputModule.disabled, InputModule.inputDefault);
    return (React.createElement(EmptyFormGroup, { label: props.label, name: props.name, onClick: () => {
            if (props.inputType === 'checkbox')
                return;
        } }, ref => (props.inputType === 'checkbox' ? (React.createElement(FormSwitch, { className: className, value: typeof internal === 'boolean' ? internal : undefined, disabled: props.disabled, onChange: checked => onChange(checked) })) : (React.createElement("input", { className: className, ref: ref, type: props.inputType, name: props.name, required: props.required, disabled: props.disabled, defaultValue: props.defaultValue, checked: typeof internal === 'boolean' ? internal : undefined, value: typeof internal === 'boolean' ? undefined : internal, onChange: e => {
            const newValue = props.inputType === 'checkbox'
                ? e.currentTarget.checked
                : typeof props.value === 'number' ? Number(e.target.value) : e.currentTarget.value;
            onChange(newValue);
        } })))));
}
function EmptyFormGroup(props) {
    const ref = useRef(null);
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
var Colors$1;
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
})(Colors$1 || (Colors$1 = {}));
const Button = Finder.findBySourceStrings("FILLED", "BRAND", "MEDIUM", "button", "buttonRef");

const GlobalNavigation = Finder.findBySourceStrings("ConnectedPrivateChannelsList", { defualtExport: false });

const NotificationBadge = Finder.findBySourceStrings('STATUS_DANGER', "numberBadge");

const ScrollerLooks = Finder.byKeys(['thin', 'fade']);
const ScrollerWrapper = Finder.findBySourceStrings("paddingFix", "getScrollerState");
ScrollerWrapper();

const getNode = Finder.findBySourceStrings("timestamp", "format", "parsed", "full", { searchExports: true });
const Timestamp = Finder.findBySourceStrings(".timestampTooltip", { defaultExport: false, }).Z;
function TimestampComponent({ unix, format }) {
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

const BadgeList = Finder.findBySourceStrings("badges", "badgeClassName", "displayProfile", "QUEST_CONTENT_VIEWED", { defaultExport: false });
var BadgeTypes;
(function (BadgeTypes) {
    BadgeTypes["NITRO_ANY"] = "premium";
    BadgeTypes["NITRO_BRONZE"] = "premium_tenure_1_month";
    BadgeTypes["NITRO_SILVER"] = "premium_tenure_3_month";
    BadgeTypes["NITRO_GOLD"] = "premium_tenure_6_month";
    BadgeTypes["NITRO_PLATINUM"] = "premium_tenure_12_month";
    BadgeTypes["NITRO_DIAMOND"] = "premium_tenure_24_month";
    BadgeTypes["NITRO_EMERALD"] = "premium_tenure_36_month";
    BadgeTypes["NITRO_RUBY"] = "premium_tenure_60_month";
    BadgeTypes["NITRO_OPAL"] = "premium_tenure_72_month";
    BadgeTypes["GUILD_BOOST_ANY"] = "booster";
    BadgeTypes["GUILD_BOOST_1"] = "guild_booster_lvl1";
    BadgeTypes["GUILD_BOOST_2"] = "guild_booster_lvl2";
    BadgeTypes["GUILD_BOOST_3"] = "guild_booster_lvl3";
    BadgeTypes["GUILD_BOOST_4"] = "guild_booster_lvl4";
    BadgeTypes["GUILD_BOOST_5"] = "guild_booster_lvl5";
    BadgeTypes["GUILD_BOOST_6"] = "guild_booster_lvl6";
    BadgeTypes["GUILD_BOOST_7"] = "guild_booster_lvl7";
    BadgeTypes["GUILD_BOOST_8"] = "guild_booster_lvl8";
    BadgeTypes["GUILD_BOOST_9"] = "guild_booster_lvl9";
    BadgeTypes["EARLY_SUPPORTER"] = "early_supporter";
    BadgeTypes["HYPESQUAD_EVENTS"] = "hypesquad";
    BadgeTypes["HYPESQUAD_BRAVERY"] = "hypesquad_house_1";
    BadgeTypes["HYPESQUAD_BRILLIANCE"] = "hypesquad_house_2";
    BadgeTypes["HYPESQUAD_BALANCE"] = "hypesquad_house_3";
    BadgeTypes["ACTIVE_DEVELOPER"] = "active_developer";
    BadgeTypes["SLASH_COMMANDS"] = "bot_commands";
    BadgeTypes["EARLY_VERIFIED_DEVELOPER"] = "verified_developer";
    BadgeTypes["BUG_HUNTER_GREEN"] = "bug_hunter_level_1";
    BadgeTypes["BUG_HUNTER_GOLD"] = "bug_hunter_level_2";
    BadgeTypes["STAFF"] = "staff";
    BadgeTypes["MODERATOR"] = "certified_moderator";
    BadgeTypes["PARTNER"] = "partner";
    BadgeTypes["AUTO_MOD"] = "automod";
    BadgeTypes["QUEST"] = "quest_completed";
    BadgeTypes["LEGACY_USERNAME"] = "legacy_username";
})(BadgeTypes || (BadgeTypes = {}));
var BadgeIconIds;
(function (BadgeIconIds) {
    BadgeIconIds["active_developer"] = "6bdc42827a38498929a4920da12695d9";
    BadgeIconIds["automod"] = "f2459b691ac7453ed6039bbcfaccbfcd";
    BadgeIconIds["bot_commands"] = "6f9e37f9029ff57aef81db857890005e";
    BadgeIconIds["bug_hunter_lvl1"] = "2717692c7dca7289b35297368a940dd0";
    BadgeIconIds["bug_hunter_lvl2"] = "848f79194d4be5ff5f81505cbd0ce1e6";
    BadgeIconIds["certified_moderator"] = "fee1624003e2fee35cb398e125dc479b";
    BadgeIconIds["guild_booster_lvl1"] = "51040c70d4f20a921ad6674ff86fc95c";
    BadgeIconIds["guild_booster_lvl2"] = "0e4080d1d333bc7ad29ef6528b6f2fb7";
    BadgeIconIds["guild_booster_lvl3"] = "72bed924410c304dbe3d00a6e593ff59";
    BadgeIconIds["guild_booster_lvl4"] = "df199d2050d3ed4ebf84d64ae83989f8";
    BadgeIconIds["guild_booster_lvl5"] = "996b3e870e8a22ce519b3a50e6bdd52f";
    BadgeIconIds["guild_booster_lvl6"] = "991c9f39ee33d7537d9f408c3e53141e";
    BadgeIconIds["guild_booster_lvl7"] = "cb3ae83c15e970e8f3d410bc62cb8b99";
    BadgeIconIds["guild_booster_lvl8"] = "7142225d31238f6387d9f09efaa02759";
    BadgeIconIds["guild_booster_lvl9"] = "ec92202290b48d0879b7413d2dde3bab";
    BadgeIconIds["hypesquad"] = "bf01d1073931f921909045f3a39fd264";
    BadgeIconIds["hypesquad_house_1"] = "8a88d63823d8a71cd5e390baa45efa02";
    BadgeIconIds["hypesquad_house_2"] = "011940fd013da3f7fb926e4a1cd2e618";
    BadgeIconIds["hypesquad_house_3"] = "3aa41de486fa12454c3761e8e223442e";
    BadgeIconIds["legacy_username"] = "6de6d34650760ba5551a79732e98ed60";
    BadgeIconIds["partner"] = "3f9748e53446a137a052f3454e2de41e";
    BadgeIconIds["premium"] = "2ba85e8026a8614b640c2837bcdfe21b";
    BadgeIconIds["premium_tenure_12_month_v2"] = "0334688279c8359120922938dcb1d6f8";
    BadgeIconIds["premium_early_supporter"] = "7060786766c9c840eb3019e725d2b358";
    BadgeIconIds["quest_completed"] = "7d9ae358c8c5e118768335dbe68b4fb8";
    BadgeIconIds["staff"] = "5e74e9b61934fc1f67c65515d1f7e60d";
    BadgeIconIds["verified_developer"] = "6df5892e0f35b051f8b61eace34f4967";
})(BadgeIconIds || (BadgeIconIds = {}));

function SearchableList(props) {
    const { items, renderItem, onSearch } = props;
    const { placeholder = 'Search...', className, noResult, take, children } = props;
    const [search, setSearch] = useState('');
    const SearchableItem = useCallback(({ item, index }) => renderItem(item, index, items), [renderItem, items]);
    const Children = useCallback(() => typeof children === 'function' ? children() : children, [children]);
    const filteredItems = items
        .filter(item => search ? onSearch(search, item) : true)
        .slice(0, take ?? 25);
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
        return (React.createElement(FormSwitch, { className: 'danho-form-switch', key: setting.toString(), note: titles[setting.toString()], value: Boolean(v), hideBorder: true, onChange: inputValue => {
                const checked = beforeChange ? beforeChange(inputValue) : inputValue;
                set({ [setting]: checked });
                onChange?.(checked);
                setV(checked);
            } }));
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

function TabBar({ tabs, ...props }) {
    const [activeTab, _setActiveTab] = useState(props.defaultTab
        ?? tabs.filter(([_, value]) => value)[0]?.[0]);
    const internalTabs = useMemo(() => {
        const set = tabs
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => acc.set(key, value), new Map());
        return [...set.entries()];
    }, [tabs, props.id]);
    const getKeyName = useCallback((key) => props.id ? `#${props.id}-${key}` : key, [props.id]);
    const TabContent = useCallback(function TabContent() {
        const contentChildren = internalTabs.map(([tab]) => [tab, typeof props[tab] === 'function'
                ? props[tab]
                : () => props[tab]]);
        return (React.createElement(React.Fragment, null, contentChildren.map(([tab, Content], key) => (React.createElement("div", { key: getKeyName(`content-${key}`), className: classNames$1("tab-bar__content-page", tab === (props.tab ?? activeTab) && 'tab-bar__content-page--active') },
            React.createElement(Content, null))))));
    }, [tabs, activeTab, props.tab]);
    const setActiveTab = useCallback((tab) => {
        if (!tab)
            return;
        if (props.beforeTabChange)
            props.beforeTabChange(tab);
        (props.setTab ?? _setActiveTab)(tab);
    }, [props.beforeTabChange, props.setTab]);
    useEffect(function onTabChanged() {
        if (props.onTabChange)
            props.onTabChange(props.tab ?? activeTab);
    }, [activeTab, props.tab, props.onTabChange]);
    useEffect(function onTabsOptionsChanged() {
        if (!tabs.find(([key]) => key === (props.tab ?? activeTab))?.[1]) {
            setActiveTab(tabs[0][0]);
        }
    }, [tabs]);
    useEffect(function onControlledTabChanged() {
        if (props.tab)
            setActiveTab(props.tab);
    }, [props.tab]);
    return (React.createElement("div", { id: props.id, className: classNames$1("tab-bar", props.className) },
        React.createElement("header", { className: classNames$1('tab-bar__tabs') },
            internalTabs.map(([tab, title]) => title &&
                React.createElement("button", { key: getKeyName(tab), className: classNames$1("tab-bar__tab", activeTab === tab && 'tab-bar__tab--active'), onClick: () => setActiveTab(tab) }, title)),
            props.children),
        React.createElement("section", { className: classNames$1('tab-bar__content') },
            React.createElement(TabContent, null))));
}

function User(props) {
    const { user, children, className, onClick, openModalOnClick } = props;
    const handleClick = () => {
        if (onClick)
            onClick(user);
        if (openModalOnClick)
            UserUtils.openModal(user.id);
    };
    return (React.createElement("div", { className: classNames("danho-discord-user", onClick && 'clickable', className), onClick: handleClick },
        React.createElement("img", { src: user.getAvatarURL(), alt: user.username, className: "danho-discord-user__avatar" }),
        React.createElement("section", { className: "danho-discord-user__info" },
            React.createElement(Text, { variant: "text-md/bold", className: "danho-discord-user__displayName" }, user.globalName ?? user.username),
            user.globalName && React.createElement(Text, { variant: "text-sm/normal", className: "danho-discord-user__username" }, user.username),
            children ? typeof children === "function" ? children(user, Text) : children : null)));
}

function CreateSettingsGroup(callback) {
    return function SettingsGroup(props) {
        const element = callback(React, props, Setting, FormElements);
        return (React.createElement(ErrorBoundary, null, element));
    };
}

function rgbToHex(rgb) {
    const integer = (((Math.round(rgb[0]) & 0xFF) << 16)
        + ((Math.round(rgb[1]) & 0xFF) << 8)
        + (Math.round(rgb[2]) & 0xFF));
    const string = integer.toString(16).toUpperCase();
    return '000000'.substring(string.length) + string;
}
function hexToRgb(hex) {
    if (!hex)
        return [0, 0, 0];
    const match = hex.match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match)
        return [0, 0, 0];
    let colorString = match[0];
    if (match[0].length === 3)
        colorString = colorString.split('').map(char => char + char).join('');
    const integer = parseInt(colorString, 16);
    const r = (integer >> 16) & 0xFF;
    const g = (integer >> 8) & 0xFF;
    const b = integer & 0xFF;
    return [r, g, b];
}
Finder.byKeys(["BRAND", "RED"]);

const PrettifyRoles = CreateSettingsGroup((React, props, Setting) => (React.createElement(React.Fragment, null,
    React.createElement(Setting, { setting: "defaultRoleColor", type: "color", ...props, formatValue: rgbString => "#" + rgbToHex(rgbString.split(',').map(Number)), beforeChange: hex => hexToRgb(hex).join(',') }),
    React.createElement(Setting, { setting: "groupRoles", ...props }))));

const UiFix = CreateSettingsGroup((React, props, Setting) => (React.createElement(React.Fragment, null,
    React.createElement(Setting, { setting: "removePrivateSearchButton", ...props }),
    React.createElement(Setting, { setting: "groupPrivateChannelNavOptions", ...props }))));

const StyleSettings = CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
    const AdditionalSettings = ({ setting }) => {
        switch (setting) {
            case 'prettyRoles': return props.settings.prettyRoles ? React.createElement(PrettifyRoles, { ...props }) : null;
            case 'uiReworkFix': return props.settings.uiReworkFix ? React.createElement(UiFix, { ...props }) : null;
            default: return null;
        }
    };
    const ignoredSettings = [
        'defaultRoleColor', 'groupRoles',
        'removePrivateSearchButton', 'groupPrivateChannelNavOptions',
    ];
    return (React.createElement(React.Fragment, null, Object.keys(StyleChanges$1)
        .filter(key => !ignoredSettings.includes(key))
        .map((key, index) => (React.createElement(React.Fragment, null,
        React.createElement(FormSection, { title: StyleChangesTitles[key], key: index },
            React.createElement(Setting, { setting: key, ...props }),
            React.createElement(AdditionalSettings, { setting: key })),
        React.createElement(FormDivider, null))))));
});

const AutoCancelFriendRequestSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    const folderNames = SortedGuildStore.getGuildFolders().map(folder => folder.folderName);
    return (React.createElement(Setting, { setting: "folderNames", type: 'select', options: folderNames, ...props }));
});

const BirthdateSettings = CreateSettingsGroup((React, props, Setting) => {
    const settings = Settings.useSelector(s => ({
        timestampStyle: s.birthdateTimestampStyle
    }));
    return (React.createElement(React.Fragment, null,
        React.createElement(Setting, { setting: "hideBirthdateIcon", ...props }),
        React.createElement(Setting, { setting: "hideBirthdateTimestamp", ...props }),
        React.createElement(Setting, { setting: "birthdateTimestampStyle", ...props, type: "select", options: [
                "D", "d",
                "T", "t",
                "F", "f",
                "R"
            ] }),
        React.createElement(TimestampComponent, { format: settings.timestampStyle, unix: Date.now() / 1000 })));
});

const DirectAndGroupTabSettings = CreateSettingsGroup((React, props, Setting) => (React.createElement(React.Fragment, null,
    React.createElement(Setting, { setting: "defaultDirectAndGroupTab", ...props, type: "select", options: ['direct', 'group'] }))));

const TimezoneSettings = CreateSettingsGroup((React, props, Setting) => (React.createElement(React.Fragment, null,
    React.createElement(Setting, { setting: "hideTimezoneIcon", ...props }),
    React.createElement(Setting, { setting: "hideTimezoneTimestamp", ...props }))));

const DiscordChangesSettings = CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
    const AdditionalSettings = ({ setting }) => {
        switch (setting) {
            case 'autoCancelFriendRequests': return props.settings.autoCancelFriendRequests ? React.createElement(AutoCancelFriendRequestSettings, { ...props }) : null;
            case 'showUserTimezone': return props.settings.showUserTimezone ? React.createElement(TimezoneSettings, { ...props }) : null;
            case 'showUserBirthdate': return props.settings.showUserBirthdate ? React.createElement(BirthdateSettings, { ...props }) : null;
            case 'directAndGroupTabs': return props.settings.directAndGroupTabs ? React.createElement(DirectAndGroupTabSettings, { ...props }) : null;
            default: return null;
        }
    };
    const ignoredSettings = [
        'folderNames',
        'hideTimezoneIcon', 'hideTimezoneTimestamp',
        'hideBirthdateIcon', 'hideBirthdateTimestamp', 'birthdateTimestampStyle',
        'defaultDirectAndGroupTab'
    ];
    return (React.createElement(React.Fragment, null, Object.keys(DiscordEnhancements$1)
        .filter(key => !ignoredSettings.includes(key))
        .map((key, index) => (React.createElement(React.Fragment, null,
        React.createElement(FormSection, { title: DiscordEnhancementsTitles[key], key: index },
            React.createElement(Setting, { setting: key, ...props }),
            React.createElement(AdditionalSettings, { setting: key })),
        React.createElement(FormDivider, null))))));
});

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
function buildTextItemElement(id, label, action, props = {}) {
    return BdApi.ContextMenu.buildItem(buildTextItem(id, label, action, props));
}
function buildSubMenu(id, label, items, props = {}) {
    return {
        type: 'submenu',
        label,
        items,
        id,
        action: () => { },
        onClose: props.onClose ?? (() => { }),
        ...props
    };
}
function buildSubMenuElement(id, label, items, props = {}) {
    return BdApi.ContextMenu.buildItem(buildSubMenu(id, label, items, props));
}
function buildCheckboxItem(id, label, checked, action, props = {}) {
    return {
        type: 'toggle',
        id,
        label,
        checked,
        action: () => action(!checked),
        onClose: props.onClose ?? (() => { }),
        ...props
    };
}
function buildCheckboxItemElement(id, label, checked, action, props = {}) {
    return BdApi.ContextMenu.buildItem(buildCheckboxItem(id, label, checked, action, props));
}
function buildSeparator() {
    return { type: 'separator' };
}

function PatchChannelContextMenu$1(callback) {
    const unpatch = BdApi.ContextMenu.patch('channel-context', (tree, props) => {
        return callback(tree, props, unpatch);
    });
    return unpatch;
}

function PatchGuildContextMenu$1(callback) {
    const unpatch = BdApi.ContextMenu.patch('guild-context', (tree, props) => {
        return callback(tree, props, unpatch);
    });
    return unpatch;
}

function PatchUserContextMenu$1(callback) {
    const unpatch = BdApi.ContextMenu.patch('user-context', (tree, props) => {
        return callback(tree, props, unpatch);
    });
    return unpatch;
}

function createContextMenuCallback(menuType, callback) {
    return callback;
}

const ClassModule = ClassNamesUtils.combineModuleByKeys(['container', 'badge']);
const CustomBadge = ({ name, iconUrl, style, href, onContextMenu, size }) => {
    if (!name || !iconUrl)
        return null;
    const compiledStyle = Object.assign({}, style, {
        width: style?.width ?? size,
        height: style?.height ?? size,
    });
    const BadgeIcon = () => React.createElement("img", { src: iconUrl, alt: name, className: ClassModule.badge, style: compiledStyle });
    const AnchorBadge = () => (React.createElement("a", { href: href, target: "_blank", rel: "noreferrer noopener", onClick: e => {
            if (href === '#')
                e.preventDefault();
        } },
        React.createElement(BadgeIcon, null)));
    return (React.createElement(Tooltip, { text: name }, props => (React.createElement("div", { ...props, onContextMenu: onContextMenu }, href ? React.createElement(AnchorBadge, null) : React.createElement(BadgeIcon, null)))));
};

const DEFAULT_STATE$1 = {
    customBadges: {
        developer: {
            id: 'developer',
            name: 'Plugin Developer',
            iconUrl: 'https://i.imgur.com/f5MDiAd.png',
            userTags: [USER_TAGS.DANHO],
            position: {
                before: BadgeTypes.ACTIVE_DEVELOPER,
                default: 0
            },
            size: '14px',
            href: 'https://github.com/DanielSimonsen90'
        },
        daniel_simonsen: {
            id: 'daniel_simonsen',
            name: 'Daniel Simonsen himself',
            iconUrl: 'https://imgur.com/jva0EMf.png',
            userTags: [USER_TAGS.DANHO],
            position: 'start',
            size: '16px',
            href: 'https://open.spotify.com/artist/2Ya69OwtcUqvAMPaE8vXdg?si=ELamxrqgR-KLZwTqYA6AXA'
        },
        mose_clan: {
            id: 'mose_clan',
            name: 'Mose Clan',
            iconUrl: 'https://imgur.com/Wm1pEfY.png',
            userTags: [USER_TAGS.DANHO, USER_TAGS.THEGUNASS, USER_TAGS.BEAUTYKILLER, USER_TAGS.EMILIE, USER_TAGS.CARL],
            size: '24px',
            position: {
                after: 'daniel_simonsen',
            }
        },
        silly_goose: {
            id: 'silly_goose',
            name: 'Silly Goose',
            iconUrl: 'https://i.imgur.com/5waDSil.png',
            userTags: [USER_TAGS.MIZBATT],
        }
    },
    users: {}
};
const CustomBadgesStore = new class CustomBadgesStore extends DiumStore {
    constructor() {
        super(DEFAULT_STATE$1, 'CustomBadgesStore', () => {
            this.removeEmptyUsers();
        });
    }
    get customBadges() {
        return Object.values(this.current.customBadges);
    }
    upsetCustomBadge(badge) {
        this.update(current => ({
            ...current,
            customBadges: {
                ...current.customBadges,
                [badge.id]: badge
            }
        }));
    }
    deleteCustomBadge(badgeId) {
        this.update(current => {
            const { [badgeId]: _, ...rest } = current.customBadges;
            return {
                users: Object.fromEntries(Object.entries(current.users).map(([userId, badges]) => {
                    return [userId, badges.filter(badge => badge !== badgeId)];
                })),
                customBadges: rest
            };
        });
    }
    updateCustomUser(userId, badgeId) {
        this.update(current => ({
            ...current,
            users: {
                ...current.users,
                [userId]: [...(current.users[userId] || []), badgeId]
            }
        }));
    }
    resetCustomBadges() {
        this.update(current => ({
            ...current,
            customBadges: DEFAULT_STATE$1.customBadges,
        }));
    }
    removeEmptyUsers() {
        const emptyUsers = Object
            .entries(this.current.users)
            .filter(([userId, badges]) => !badges.length)
            .map(([userId]) => userId);
        if (emptyUsers.length) {
            this.update(current => ({
                ...current,
                users: Object.fromEntries(Object.entries(current.users).filter(([userId]) => !emptyUsers.includes(userId))),
            }));
        }
    }
};
DanhoStores.register(CustomBadgesStore);

const BadgeGroups = {
    discord: ['staff', 'partner', 'certified_moderator', 'automod'],
    bug_hunter: ['bug_hunter_level_2', 'bug_hunter_level_1'],
    hypesquad: ['hypesquad', 'hypesquad_house_1', 'hypesquad_house_2', 'hypesquad_house_3'],
    programming: ['verified_developer', 'active_developer', 'bot_commands'],
    nitro: ['premium', 'premium_tenure_1_month_v2', 'premium_tenure_3_month_v2', 'premium_tenure_6_month_v2', 'premium_tenure_12_month_v2', 'premium_tenure_24_month_v2', 'premium_tenure_36_month_v2', 'premium_tenure_60_month_v2', 'premium_tenure_72_month_v2', 'early_supporter'],
    server_boost: ['guild_booster_lvl1', 'guild_booster_lvl2', 'guild_booster_lvl3', 'guild_booster_lvl4', 'guild_booster_lvl5', 'guild_booster_lvl6', 'guild_booster_lvl7', 'guild_booster_lvl8', 'guild_booster_lvl9'],
    other: ['legacy_username', 'quest_completed'],
};
const DiscordBadgeStore = new class DiscordBadgeStore extends DiumStore {
    constructor() {
        super({}, 'DiscordBadgeStore', () => {
            ActionsEmitter.on('USER_PROFILE_FETCH_SUCCESS', this.onUserProfileFetchSuccess.bind(this));
        });
        this.onUserProfileFetchSuccess = createActionCallback('USER_PROFILE_FETCH_SUCCESS', ({ badges }) => {
            if (!badges?.length)
                return;
            const updates = badges.filter(badge => {
                const stored = this.current[badge.id];
                return !stored || stored.icon !== badge.icon;
            });
            if (updates.length)
                this.update(current => ({
                    ...current,
                    ...updates.reduce((acc, badge) => {
                        acc[badge.id] = badge;
                        return acc;
                    }, {})
                }));
        });
    }
    findBadgeByUrl(url, instance) {
        if (!url && !instance)
            return null;
        let found = url ? Object.values(this.current).find(badge => url.includes(badge.icon)) : null;
        found ??= !instance || typeof instance.props.text === 'string' ? null : instance.props.text.props.profileBadge;
        if (found && !this.current[found.id])
            this.update(current => ({
                ...current,
                [found.id]: found,
            }));
        return found;
    }
    addBadge(badge) {
        this.update(current => ({
            ...current,
            [badge.id]: badge,
        }));
    }
    getBadgeName(badgeId) {
        switch (badgeId) {
            case 'certified_moderator': return 'Moderator Programs Alumni';
            case 'bug_hunter_level_1': return 'Discord Bug Hunter';
            case 'bug_hunter_level_2': return 'Discord Bug Hunter';
            case 'bot_commands': return 'Supports Commands';
            case 'hypesquad': return 'HypeSquad Events';
            case 'hypesquad_house_1': return 'HypeSquad Bravery';
            case 'hypesquad_house_2': return 'HypeSquad Brilliance';
            case 'hypesquad_house_3': return 'HypeSquad Balance';
            case 'premium': return 'Discord Nitro';
            case 'premium_tenure_1_month_v2': return 'Nitro Bronze';
            case 'premium_tenure_3_month_v2': return 'Nitro Silver';
            case 'premium_tenure_6_month_v2': return 'Nitro Gold';
            case 'premium_tenure_12_month_v2': return 'Nitro Platinum';
            case 'premium_tenure_24_month_v2': return 'Nitro Diamond';
            case 'premium_tenure_36_month_v2': return 'Nitro Emerald';
            case 'premium_tenure_48_month_v2': return 'Nitro Sapphire';
            case 'premium_tenure_60_month_v2': return 'Nitro Ruby';
            case 'premium_tenure_72_month_v2': return 'Nitro Opal';
            case 'guild_booster_lvl1': return 'Server Booster';
            case 'guild_booster_lvl2': return 'Server Booster';
            case 'guild_booster_lvl3': return 'Server Booster';
            case 'guild_booster_lvl4': return 'Server Booster';
            case 'guild_booster_lvl5': return 'Server Booster';
            case 'guild_booster_lvl6': return 'Server Booster';
            case 'guild_booster_lvl7': return 'Server Booster';
            case 'guild_booster_lvl8': return 'Server Booster';
            case 'guild_booster_lvl9': return 'Server Booster';
            default: return badgeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }
};
DanhoStores.register(DiscordBadgeStore);

const BadgePositionsStore = new class BadgePositionsStore extends DiumStore {
    constructor(defaultState = {}) {
        super(defaultState, "BadgePositionsStore");
        this.getDiscordBadgesPositions = () => [
            ...(Settings.current.movePremiumBadge ? [] : NitroBadges),
            'staff',
            'partner',
            'certified_moderator',
            'automod',
            'hypesquad',
            'bug_hunter_level_2',
            'bug_hunter_level_1',
            'hypesquad_house_3',
            'hypesquad_house_2',
            'hypesquad_house_1',
            'verified_developer',
            'active_developer',
            'bot_commands',
            ...(Settings.current.movePremiumBadge ? NitroBadges : []),
            'early_supporter',
            'guild_booster_lvl9',
            'guild_booster_lvl8',
            'guild_booster_lvl7',
            'guild_booster_lvl6',
            'guild_booster_lvl5',
            'guild_booster_lvl4',
            'guild_booster_lvl3',
            'guild_booster_lvl2',
            'guild_booster_lvl1',
            'legacy_username',
            'quest_completed',
        ];
    }
    getSortedBadgeIds() {
        return Object.entries(this.current)
            .sort(([, a], [, b]) => a - b)
            .map(([badgeId]) => badgeId);
    }
    getSortedBadges() {
        return this.getSortedBadgeIds()
            .map(badgeId => this.getBadge(badgeId));
    }
    getBadgePosition(badgeId) {
        return this.current[badgeId] ?? -1;
    }
    setBadgePosition(badgeId, position) {
        const ids = this.getSortedBadgeIds();
        ids.splice(position, 0, badgeId);
        this.update(ids.reduce((acc, id, index) => {
            acc[id] = index;
            return acc;
        }, {}));
    }
    deleteBadgePosition(badgeId) {
        this.delete(badgeId);
    }
    sort(badgeIds) {
        const sortedBadgeIds = this.getSortedBadgeIds();
        const positions = this.current;
        return badgeIds.sort((a, b) => {
            const aIndex = sortedBadgeIds.indexOf(a);
            const bIndex = sortedBadgeIds.indexOf(b);
            if (aIndex === -1 && bIndex === -1)
                return 0;
            if (aIndex === -1)
                return 1;
            if (bIndex === -1)
                return -1;
            return positions[a] - positions[b];
        });
    }
    useEditorStore(selectedBadgeId) {
        const getDefaultSortedBadgeIdsState = useCallback((sortedIds) => {
            if (selectedBadgeId && !sortedIds.includes(selectedBadgeId))
                sortedIds.push(selectedBadgeId);
            return sortedIds;
        }, [selectedBadgeId]);
        const [sortedBadgeIds, setSortedBadgeIds] = useState(() => getDefaultSortedBadgeIdsState(this.getSortedBadgeIds()));
        const getDefaultStoreState = useCallback(() => {
            return sortedBadgeIds.reduce((acc, badgeId, index) => {
                acc[badgeId] = index;
                return acc;
            }, {});
        }, [sortedBadgeIds]);
        useEffect(() => setSortedBadgeIds(getDefaultSortedBadgeIdsState), [selectedBadgeId]);
        const editorStore = new BadgePositionsStore(getDefaultStoreState());
        const ministore = {
            sort: (badgeIds) => editorStore.sort(badgeIds),
            getSortedBadges: () => sortedBadgeIds.map(badgeId => editorStore.getBadge(badgeId, true)),
            getBadgePosition: (badgeId) => editorStore.getBadgePosition(badgeId),
            setBadgePosition: (badgeId, position) => {
                const ids = sortedBadgeIds.includes(badgeId) ? sortedBadgeIds.filter(id => id !== badgeId) : sortedBadgeIds;
                ids.splice(position, 0, badgeId);
                setSortedBadgeIds(ids);
            }
        };
        return Object.assign(ministore, Object.freeze({
            selectedBadgeId,
            sortedBadgeIds,
            get defaultStoreState() {
                return getDefaultStoreState();
            },
            get current() {
                return editorStore.current;
            }
        }));
    }
    getBadge(badgeId, suppressWarning = false) {
        if (!badgeId)
            return null;
        const discordBadge = DiscordBadgeStore.current[badgeId];
        const customBadge = CustomBadgesStore.current?.customBadges?.[badgeId];
        if (!discordBadge && !customBadge) {
            if (!suppressWarning)
                warn(`Failed to find badge in DiscordBadgesStore`, badgeId);
            return null;
        }
        return {
            id: badgeId,
            name: discordBadge?.description ?? customBadge.name,
            iconUrl: discordBadge?.icon ? UrlUtils.badgeIcon(discordBadge.icon) : customBadge.iconUrl,
            url: discordBadge?.link ?? customBadge?.href,
            style: customBadge?.size ? {
                width: customBadge.size,
                height: customBadge.size,
            } : undefined
        };
    }
};
DanhoStores.register(BadgePositionsStore);
const NitroBadges = [
    'premium_tenure_72_month_v2',
    'premium_tenure_60_month_v2',
    'premium_tenure_48_month_v2',
    'premium_tenure_36_month_v2',
    'premium_tenure_24_month_v2',
    'premium_tenure_12_month_v2',
    'premium_tenure_6_month_v2',
    'premium_tenure_3_month_v2',
    'premium_tenure_1_month_v2',
    'premium',
];

const PotentialUser = (props) => {
    const { user, modifyBadge, selectedBadge, setModifyBadge, badgePositionsStoreEditor, badgeIdsInTooltip } = props;
    const [badgeIds, badges, customBadges] = useMemo(() => {
        const displayProfile = UserProfileStore.getUserProfile(user.id);
        const badges = (displayProfile?.badges ??
            displayProfile?.getBadges() ??
            []);
        const addedBadges = CustomBadgesStore.current.users[user.id] ?? [];
        const customBadges = CustomBadgesStore.customBadges
            .filter(badge => badge.userTags?.includes(user.username));
        const badgeIds = [
            ...badges.map(badge => badge.id),
            ...addedBadges,
            ...customBadges.map(badge => badge.id),
        ];
        return [badgeIds, badges, customBadges];
    }, [user, modifyBadge, badgePositionsStoreEditor]);
    const compiledBadges = useMemo(() => {
        if (!badgeIds.includes(selectedBadge.id) || !badgeIds.includes(modifyBadge.id))
            badgeIds.push(selectedBadge.id);
        return badgePositionsStoreEditor.sort(badgeIds).map(badgeId => {
            const badge = (badges.find(badge => badge.id === badgeId)
                || badgeId in DiscordBadgeStore.current ? DiscordBadgeStore.current[badgeId] : null);
            if (badge)
                return {
                    id: badge.id,
                    name: badgeIdsInTooltip ? badge.id : badge.description,
                    iconUrl: UrlUtils.badgeIcon(badge.icon),
                    href: badge.link,
                };
            if (badgeId === modifyBadge.id || badgeId === selectedBadge.id)
                return modifyBadge;
            const customBadge = customBadges.find(badge => badge.id === badgeId);
            if (customBadge)
                return {
                    ...customBadge,
                    name: badgeIdsInTooltip ? customBadge.id : customBadge.name,
                };
            Logger.warn(`Badge ${badgeId} not found in DiscordBadgeStore or CustomBadgesStore`, {
                badges,
                modifyBadge,
            });
            return null;
        }).filter(Boolean);
    }, [badges, modifyBadge, selectedBadge, badgeIds, customBadges, badgePositionsStoreEditor, badgeIdsInTooltip]);
    return (React.createElement(Tooltip, { text: `Give ${modifyBadge.name} to ${UserUtils.getUsernames(user).shift()}` }, props => (React.createElement("div", { className: 'tooltip-inner', ...props },
        React.createElement(User, { user: user, className: classNames('potential-user', modifyBadge.userTags?.includes(user.username) && 'border-success'), onClick: () => setModifyBadge(current => ({ ...current, userTags: current.userTags ? [...current.userTags, user.username] : [user.username] })) },
            React.createElement("div", { className: "danho-user-badge-list" }, compiledBadges.map(badge => React.createElement(CustomBadge, { key: badge.id, ...badge }))))))));
};

function PositionInput({ selectedBadge, modifyBadge, badgePositionsStoreEditor }) {
    const forceUpdate = useForceUpdate();
    const badges = badgePositionsStoreEditor.getSortedBadges();
    return (React.createElement("div", { className: "position-input", role: "list" }, badges.map((badge, position) => !badge || badge.id === selectedBadge.id ? (React.createElement(CustomBadge, { key: modifyBadge.id, name: "", iconUrl: "", ...modifyBadge, href: modifyBadge.href ? '#' : undefined })) : (React.createElement(CustomBadge, { key: badge.id, name: badge.name, style: badge.style, iconUrl: badge.iconUrl, href: badge.url ? '#' : undefined, onContextMenu: e => {
            BdApi.ContextMenu.open(e, buildContextMenu(buildTextItem('badge-move-before', `Move ${modifyBadge.name} before ${badge.name} (left)`, () => {
                badgePositionsStoreEditor.setBadgePosition(selectedBadge.id, position);
                forceUpdate();
            }), buildTextItem('badge-move-after', `Move ${modifyBadge.name} after ${badge.name} (right)`, () => {
                badgePositionsStoreEditor.setBadgePosition(selectedBadge.id, position + 1);
                forceUpdate();
            })));
        } })))));
}

function useFormTab(refResolve, ...exclude) {
    const formRef = undefined;
    useMemo(() => {
        return [];
    }, [formRef, exclude]);
    useKeybind(['Tab'], () => { });
    return {
            onKeyDown: (e) => {
                if (e.key !== 'Tab')
                    return;
                e.preventDefault();
                const forms = document.querySelectorAll('form');
                const form = Array.from(forms).find(form => form.contains(e.target));
                if (!form)
                    return;
                const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
                const currentIndex = inputs.indexOf(e.target);
                const nextIndex = (currentIndex + 1) % inputs.length;
                inputs[nextIndex].focus();
            }
        };
}

function CustomBadgeModifyForm(props) {
    const { selectedBadgeId, setSelectedBadgeId } = props;
    const [badgeIdsInTooltip, setBadgeIdsInTooltip] = useState(false);
    const selectedBadge = useMemo(() => (CustomBadgesStore.current.customBadges[selectedBadgeId] ?? {
        id: selectedBadgeId,
    }), [selectedBadgeId]);
    const [modifyBadge, setModifyBadge] = useState(() => selectedBadge);
    const badgePositionsStoreEditor = BadgePositionsStore.useEditorStore(selectedBadgeId);
    const formTabProps = useFormTab();
    const formItemModel = ObjectUtils.exclude(modifyBadge, 'userTags');
    const hasChanges = !ObjectUtils.isEqual(modifyBadge, selectedBadge);
    const isNewBadge = (!(modifyBadge.id in CustomBadgesStore.current.customBadges) &&
        !(selectedBadge.id in CustomBadgesStore.current.customBadges));
    useEffect(() => {
        setModifyBadge(selectedBadge);
    }, [selectedBadge]);
    return (React.createElement("form", { className: "custom-badge-modify-container", ...formTabProps },
        React.createElement(Text, { variant: 'heading-xl/bold' },
            isNewBadge ? 'Create' : 'Edit',
            " ",
            modifyBadge.name ?? 'your own badge'),
        React.createElement(FormItemFromModel, { model: formItemModel, property: 'id', onChange: id => setModifyBadge(current => ({ ...current, id })) }),
        React.createElement(FormItemFromModel, { model: formItemModel, property: 'name', onChange: name => setModifyBadge(current => ({ ...current, name })) }),
        React.createElement(FormItemFromModel, { model: formItemModel, property: 'iconUrl', onChange: iconUrl => setModifyBadge(current => ({ ...current, iconUrl })), label: "Url to icon" }),
        React.createElement(FormItemFromModel, { model: formItemModel, property: 'href', onChange: href => setModifyBadge(current => ({ ...current, href })), label: "External URL when clicked" }),
        React.createElement(FormItem, { label: "Show badge id in tooltip instead of its name", value: badgeIdsInTooltip, onChange: value => setBadgeIdsInTooltip(value) }),
        React.createElement(SearchableList, { items: UserUtils.getUsersPrioritizingFriends(), take: 4, onSearch: (search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search.toLowerCase())), renderItem: user => (React.createElement(PotentialUser, { user: user, modifyBadge: modifyBadge, badgePositionsStoreEditor: badgePositionsStoreEditor, selectedBadge: selectedBadge, setModifyBadge: setModifyBadge, badgeIdsInTooltip: badgeIdsInTooltip })) }),
        React.createElement(EmptyFormGroup, { label: "Badge position", name: "position" }, () => React.createElement(PositionInput, { selectedBadge: selectedBadge, modifyBadge: modifyBadge, badgePositionsStoreEditor: badgePositionsStoreEditor })),
        React.createElement(FormItemFromModel, { model: formItemModel, property: 'size', defaultValue: '20px', onChange: size => setModifyBadge(current => ({ ...current, size: size })) }),
        React.createElement("div", { className: "button-panel" },
            React.createElement(Button, { type: "reset", color: Button.Colors.RED, look: Button.Looks.OUTLINED, onClick: () => setSelectedBadgeId(null) },
                "Deselect ",
                modifyBadge.name || selectedBadge.name,
                " without saving"),
            React.createElement(Button, { type: "submit", color: isNewBadge ? Button.Colors.GREEN : Button.Colors.YELLOW, look: Button.Looks.FILLED, disabled: !hasChanges, onClick: () => {
                    if (!modifyBadge.iconUrl || !modifyBadge.name || !modifyBadge.id)
                        return;
                    if (badgePositionsStoreEditor.getBadgePosition(selectedBadge.id) !== BadgePositionsStore.getBadgePosition(selectedBadge.id)) {
                        BadgePositionsStore.setBadgePosition(modifyBadge.id, badgePositionsStoreEditor.getBadgePosition(selectedBadge.id));
                    }
                    if (modifyBadge.id !== selectedBadge.id) {
                        CustomBadgesStore.deleteCustomBadge(selectedBadge.id);
                        BadgePositionsStore.deleteBadgePosition(selectedBadge.id);
                    }
                    CustomBadgesStore.upsetCustomBadge(modifyBadge);
                    setSelectedBadgeId(null);
                } },
                isNewBadge ? 'Create' : 'Save',
                " ",
                modifyBadge.name || selectedBadge.name))));
}

const BadgesSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Setting, { setting: "useClientCustomBadges", ...props }),
        props.settings.useClientCustomBadges && React.createElement(CustomBadgesSettingsGroup, { ...props })));
});
const CustomBadgesSettingsGroup = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    const [selectedBadgeId, setSelectedBadgeId] = useState(null);
    const forceUpdate = useForceUpdate();
    const modifyUserToBadge = useModifyUserToBadge(forceUpdate);
    CustomBadgesStore.useListener(forceUpdate);
    return (React.createElement(FormSection, { title: "Custom Badges" },
        selectedBadgeId && React.createElement(CustomBadgeModifyForm, { selectedBadgeId: selectedBadgeId, setSelectedBadgeId: setSelectedBadgeId }),
        React.createElement(SearchableList, { items: CustomBadgesStore.customBadges, className: "custom-badge-list", onSearch: (search, item) => [item.name, item.id, item.href].some(value => value.toLowerCase().includes(search.toLowerCase())), placeholder: "Search for a badge to modify...", renderItem: (badge, i) => (React.createElement("section", { className: classNames('custom-badge-container', i % 2 === 0 && 'custom-badge-container--alternate'), key: badge.id },
                React.createElement(CustomBadge, { key: badge.id, ...ObjectUtils.exclude(badge, 'size'), onContextMenu: e => {
                        BdApi.ContextMenu.open(e, createCustomBadgeContextMenu({
                            onEdit: () => setSelectedBadgeId(badge.id),
                            onDelete: () => {
                                BdApi.UI.showConfirmationModal(`Delete ${badge.name}?`, (React.createElement("div", null,
                                    React.createElement(Text, { variant: "text-md/normal" },
                                        "Are you sure you want to delete ",
                                        badge.name,
                                        "?"),
                                    React.createElement(Text, { variant: "text-sm/normal" }, "This action cannot be undone."))), {
                                    confirmText: `Delete ${badge.name}`,
                                    onConfirm() {
                                        BadgePositionsStore.deleteBadgePosition(badge.id);
                                        CustomBadgesStore.deleteCustomBadge(badge.id);
                                    }
                                });
                            }
                        }));
                    } }),
                React.createElement("aside", { className: "custom-badge-info" },
                    React.createElement(ErrorBoundary, { id: "users-list" },
                        React.createElement("div", { role: "list", className: "users" }, badge.userTags
                            ? badge.userTags.map(userTag => {
                                const user = UserUtils.getUserByUsername(userTag);
                                const onClick = () => modifyUserToBadge(badge.id, userTag, 'remove');
                                const child = user
                                    ? React.createElement(User, { user: user, onClick: onClick })
                                    : React.createElement(Text, { variant: "text-md/normal" }, userTag);
                                return (React.createElement(Tooltip, { text: `Remove ${badge.name} from ${UserUtils.getUsernames(user).shift()}` }, props => (React.createElement("div", { ...props, className: "user-tooltip", onClick: onClick }, child))));
                            })
                            : React.createElement(Text, { variant: "text-sm/normal" }, "None"))),
                    React.createElement(ErrorBoundary, { id: "potential-users" },
                        React.createElement(SearchableList, { className: "potential-users", items: UserUtils.getUsersPrioritizingFriends().filter(user => badge.userTags ? badge.userTags.includes(user.username) === false : true), onSearch: (search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search.toLowerCase())), placeholder: 'Give this badge to...', renderItem: user => (React.createElement(Tooltip, { text: `Give ${badge.name} to ${UserUtils.getUsernames(user).shift()}` }, props => {
                                const onClick = () => modifyUserToBadge(badge.id, user.username, 'add');
                                return (React.createElement("div", { ...props, className: "user-tooltip", onClick: onClick },
                                    React.createElement(User, { user: user, onClick: onClick })));
                            })) }))))) },
            React.createElement(Button, { type: "button", className: "create-new-badge-button", look: Button.Looks.FILLED, color: Button.Colors.GREEN, size: Button.Sizes.SMALL, onClick: () => setSelectedBadgeId(`custom-badge__${StringUtils.generateRandomId()}`) }, "Create new badge"))));
});
function createCustomBadgeContextMenu({ onEdit, onDelete }) {
    return buildContextMenu(buildTextItem('badge-edit', 'Edit', onEdit), buildTextItem('badge-delete', 'Delete', onDelete, {
        danger: true,
    }));
}
function useModifyUserToBadge(forceUpdate) {
    return function modifyUserToBadge(badgeId, userTag, state) {
        const badge = CustomBadgesStore.current.customBadges[badgeId];
        if (!badge)
            return;
        if (badge.userTags && badge.userTags.includes(userTag) && state === 'add')
            return;
        if (badge.userTags && !badge.userTags.includes(userTag) && state === 'remove')
            return;
        badge.userTags = badge.userTags || [];
        if (state === 'add')
            badge.userTags.push(userTag);
        else
            badge.userTags = badge.userTags.filter(tag => tag !== userTag);
        CustomBadgesStore.upsetCustomBadge(badge);
        forceUpdate();
    };
}

const LockSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Setting, { setting: "lockPassword", ...props }),
        React.createElement(Setting, { setting: "lockUnlockForMinutes", ...props, type: "number" }),
        React.createElement(Setting, { setting: "initialLockState", ...props })));
});

const HidingSettings = CreateSettingsGroup((React, props, Setting) => (React.createElement(Setting, { setting: "isHidingOnPurpose", ...props })));

const DanhoChangesSettings = CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
    const AdditionalSettings = ({ setting }) => {
        switch (setting) {
            case 'badges': return props.settings.badges ? React.createElement(BadgesSettings, { ...props }) : null;
            case 'lockChannels': return props.settings.lockChannels ? React.createElement(LockSettings, { ...props }) : null;
            case 'wakeUp': return props.settings.wakeUp ? React.createElement(HidingSettings, { ...props }) : null;
            default: return null;
        }
    };
    const ignoredSettings = [
        'useClientCustomBadges',
        'lockPassword', 'lockUnlockForMinutes', 'initialLockState',
        'isHidingOnPurpose'
    ];
    return (React.createElement(React.Fragment, null, Object.keys(DanhoEnhancements$1)
        .filter(key => !ignoredSettings.includes(key))
        .map((key, index) => (React.createElement(React.Fragment, null,
        React.createElement(FormSection, { title: DanhoEnhancementsTitles[key], key: index },
            React.createElement(Setting, { setting: key, ...props }),
            React.createElement(AdditionalSettings, { setting: key })),
        React.createElement(FormDivider, null))))));
});

function SettingsPanel() {
    const [settings, set] = Settings.useState();
    const tabs = Settings.useSelector(({ styleChanges, discordEnhancements, danhoEnhancements }) => [
        ['styleChanges', styleChanges ? 'Style Changes' : null],
        ['discordEnhancements', discordEnhancements ? 'Discord Enhancements' : null],
        ['danhoEnhancements', danhoEnhancements ? 'Danho Enhancements' : null],
    ]);
    const settingProps = { settings, set, titles };
    return (React.createElement("div", { className: "danho-plugin-settings" },
        React.createElement(FormSection, { title: "Danho Library Features" },
            React.createElement(Setting, { setting: "styleChanges", ...settingProps }),
            React.createElement(Setting, { setting: "discordEnhancements", ...settingProps }),
            React.createElement(Setting, { setting: "danhoEnhancements", ...settingProps })),
        tabs.some(([_, value]) => value) && (React.createElement(TabBar, { tabs: tabs, styleChanges: React.createElement(StyleSettings, { ...settingProps }), discordEnhancements: React.createElement(DiscordChangesSettings, { ...settingProps }), danhoEnhancements: React.createElement(DanhoChangesSettings, { ...settingProps }) }))));
}

const classModule = Finder.byKeys(["sectionDivider", "themedSearchBarMobile"]);
function PrivateChannelList(ListClass) {
    const defaultTab = Settings.useSelector(s => s.defaultDirectAndGroupTab);
    const [selectedTab, setSelectedTab] = React.useState(defaultTab);
    return class DanhoPrivateChannelList extends ListClass {
        componentDidMount() {
            super.componentDidMount();
            ActionsEmitter.on('MESSAGE_CREATE', this.onMessageCreate);
            ActionsEmitter.on('MESSAGE_ACK', this.onMessageAck);
        }
        componentWillUnmount() {
            ActionsEmitter.off('MESSAGE_CREATE', this.onMessageCreate);
            ActionsEmitter.off('MESSAGE_ACK', this.onMessageAck);
        }
        constructor(props) {
            super(props);
            this.onMessageCreate = createActionCallback('MESSAGE_CREATE', ({ channelId }) => this.onNewMessage(channelId)).bind(this);
            this.onMessageAck = createActionCallback('MESSAGE_ACK', ({ channelId }) => this.onNewMessage(channelId)).bind(this);
            this.__originalRenderDM = 'renderDM' in this ? this.renderDM : undefined;
            this.renderDM = this.patchedRenderDM.bind(this);
            this.__originalRenderSection = 'renderSection' in this ? this.renderSection : undefined;
            this.renderSection = this.patchedRenderSection.bind(this);
            this.__originalGetRowHeight = 'getRowHeight' in this ? this.getRowHeight : undefined;
            this.getRowHeight = this.patchedGetRowHeight.bind(this);
        }
        render() {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "danho-private-channel-list__space-enabler" }),
                super.render()));
        }
        patchedRenderDM(section, row) {
            const { privateChannelIds, channels } = this.props;
            const channel = channels[privateChannelIds[row]];
            if (!channel)
                return null;
            if (channel.isMultiUserDM() && selectedTab !== 'group')
                return null;
            if (channel.isDM() && selectedTab !== 'direct')
                return null;
            return this.__originalRenderDM(section, row);
        }
        patchedRenderSection(rowData) {
            const { section } = rowData;
            const { showDMHeader, channels } = this.props;
            if (section === 0 || !showDMHeader)
                return this.__originalRenderSection(rowData);
            const TabButton = this.renderTabButton.bind(this);
            const getNotificationCount = (state) => Object
                .values(channels)
                .filter(channel => state === 'group'
                ? channel.isMultiUserDM()
                : state === 'direct' && channel.isDM())
                .map(channel => channel.id)
                .filter(channelId => ReadStateStore.hasUnread(channelId))
                .reduce((acc, channelId) => acc + ReadStateStore.getUnreadCount(channelId), 0);
            return (React.createElement("div", { className: 'tab-bar tab-bar--private-channels' },
                React.createElement("header", { className: 'tab-bar__tabs' },
                    React.createElement(TabButton, { setState: 'direct', label: 'Direct', notifications: getNotificationCount('direct') }),
                    React.createElement(TabButton, { setState: 'group', label: 'Group', notifications: getNotificationCount('group') })),
                React.createElement("div", { className: classModule.sectionDivider })));
        }
        patchedGetRowHeight(rowData) {
            const { section, row } = rowData;
            return this.renderDM(section, row) ? this.__originalGetRowHeight(rowData) : 0;
        }
        renderTabButton(props) {
            const { setState: state, label, notifications } = props;
            const look = state === selectedTab ? Button.Looks.LINK : Button.Looks.BLANK;
            return (React.createElement("div", { className: "tab-button" },
                notifications > 0 ? React.createElement(NotificationBadge, { count: notifications }) : null,
                React.createElement(Button, { size: Button.Sizes.TINY, look: look, color: Button.Colors.BLACK, "data-selected": state === selectedTab, onClick: () => setSelectedTab(state) }, label)));
        }
        onNewMessage(channelId) {
            if (this.props.privateChannelIds.includes(channelId)) {
                this.forceUpdate();
            }
        }
    };
}

const style$5 = ".tab-bar--private-channels {\n  --padding: 0ch;\n  padding-right: var(--padding);\n  padding-left: calc(var(--padding) + 5px);\n  padding-bottom: 1ch;\n}\n.tab-bar--private-channels .tab-bar__tabs .tab-button {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.tab-bar--private-channels .tab-bar__tabs .tab-button:last-child::before {\n  content: \"\";\n  width: 1px;\n  height: 100%;\n  background-color: var(--background-primary);\n  position: absolute;\n  left: 0;\n}\n.tab-bar--private-channels .tab-bar__tabs button {\n  padding-inline: 0;\n  position: relative;\n}\n.tab-bar--private-channels .tab-bar__tabs button[data-selected=true] {\n  font-weight: bold;\n}\n.tab-bar--private-channels .tab-bar__tabs button[data-selected=true] * {\n  position: relative;\n  margin: 0;\n}\n.tab-bar--private-channels .tab-bar__tabs button[data-selected=false] * {\n  color: var(--text-muted);\n}\n.tab-bar--private-channels .tab-bar__tabs button[data-selected=false] *:hover {\n  color: var(--interactive-hover);\n}\n\nnav[class*=privateChannels]:has(.danho-private-channel-list__space-enabler) div[class*=scroller] {\n  --margin-addition: 1em;\n  margin-bottom: calc(var(--custom-app-panels-height, 0) + 8px + var(--margin-addition));\n}";

function Feature$a() {
    if (!Settings.current.directAndGroupTabs)
        return;
    const module = Finder.findBySourceStrings('ConnectedPrivateChannelsList', { defaultExport: false });
    if (!module)
        return;
    after(module, 'Z', ({ result }) => {
        const B = result.props.children.type;
        const DanhoPrivateChannelList = PrivateChannelList(B);
        result.props.children = React.createElement(DanhoPrivateChannelList, { ...result.props.children.props });
    });
}

const DirectAndGroupTabs = {
    __proto__: null,
    default: Feature$a,
    style: style$5
};

function Feature$9() {
    const relativeTimeModule = Finder.findBySourceStrings('"R"!==e.format', { defaultExport: false });
    if (!relativeTimeModule)
        return false;
    after(relativeTimeModule, 'Z', ({ result, args: [args] }) => {
        if (args.format !== 'R')
            return result;
        const date = args.parsed.toDate();
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const getTime = (value, time) => {
            const result = Math.floor(diff / value);
            return result > 0 ? `${result} ${time}${result > 1 ? 's' : ''} ago` : null;
        };
        return (diff < 0 && result
            || getTime(YEAR, 'year')
            || getTime(MONTH, 'month')
            || getTime(WEEK, 'week')
            || getTime(DAY, 'day')
            || getTime(HOUR, 'hour')
            || getTime(MINUTE, 'minute')
            || getTime(SECOND, 'second')
            || `A long time ago, in a galaxy far, far away... (parsing failed)`);
    });
}

const FixRelativeTimestamps = {
    __proto__: null,
    default: Feature$9
};

const DEFAULT_STATE = {
    channels: {},
    guilds: {},
};
const HiddenChannelStore = new class HiddenChannelStore extends DiumStore {
    constructor() {
        super(DEFAULT_STATE, 'HiddenChannelStore', () => {
            ActionsEmitter.on('CHANNEL_SELECT', this.onChannelSelect.bind(this));
        });
        this.onChannelSelect = createActionCallback('CHANNEL_SELECT', ({ channelId }) => {
            const previousChannelId = SelectedChannelStore.getLastSelectedChannelId();
            const isHidden = this.isHidden(previousChannelId);
            if (!isHidden)
                return;
            if (this.hasActiveTimer(previousChannelId)) {
                this.restartVisibilityTimer(previousChannelId);
            }
            if (this.hasActiveTimer(channelId)) {
                this.clearVisibilityTimer(channelId);
            }
        });
    }
    updateChannelState(channelId, state) {
        const channelState = this.current.channels[channelId] || {};
        const updatedState = {
            ...channelState,
            ...state,
        };
        this.update(current => ({
            ...current,
            channels: {
                ...current.channels,
                [channelId]: state ? updatedState : state
            }
        }));
    }
    updateGuildState(guildId, state) {
        const guildState = this.current.guilds[guildId] || {};
        const updatedState = {
            ...guildState,
            ...state,
        };
        this.update(current => ({
            ...current,
            guilds: {
                ...current.guilds,
                [guildId]: state ? updatedState : state
            }
        }));
    }
    isHidden(channelId) {
        return this.current.channels[channelId]?.hidden || false;
    }
    hideChannel(channelId) {
        const hiddenChannel = this.current.channels[channelId];
        if (hiddenChannel?.stayVisibleTimeout)
            clearTimeout(hiddenChannel.stayVisibleTimeout);
        this.updateChannelState(channelId, {
            hidden: true,
        });
    }
    showChannel(channelId) {
        this.updateChannelState(channelId, undefined);
    }
    showsHiddenChannels(guildId) {
        return this.current.guilds[guildId]?.showHiddenChannels;
    }
    showHiddenChannels(guildId) {
        this.updateGuildState(guildId, {
            showHiddenChannels: true,
        });
    }
    hideHiddenChannels(guildId) {
        this.updateGuildState(guildId, {
            showHiddenChannels: false,
        });
    }
    shouldRenderChannel(channelId) {
        if (this.showsHiddenChannels(GuildUtils.currentId))
            return true;
        if (this.isCategoryChannel(channelId))
            return this.shouldRenderCategory(channelId);
        const { guildChannels } = ChannelListStore.getGuild(GuildUtils.currentId) ?? {};
        const channel = ChannelStore.getChannel(channelId);
        const isHidden = this.isHidden(channelId);
        const isUnread = ReadStateStore.hasUnread(channelId);
        const hasVoiceActivity = !!VoiceStore.getVoiceStateForChannel(channelId);
        const optInEnabled = guildChannels?.optInEnabled ?? false;
        const isOptedIn = optInEnabled
            && ((guildChannels?.optedInChannels.has(channelId) ?? false)
                || (guildChannels?.optedInChannels.has(channel.parent_id) ?? false));
        const isMutedAndHidden = (guildChannels.mutedChannelIds.has(channelId)
            && guildChannels.hideMutedChannels);
        this.stayVisisbleTimeout(channelId, isUnread);
        const shouldRender = isHidden
            ? isUnread || hasVoiceActivity
            : optInEnabled
                ? isOptedIn && !isMutedAndHidden
                : !isMutedAndHidden;
        return shouldRender;
    }
    isCategoryChannel(channelId) {
        return ChannelStore.getChannel(channelId)?.type === 4 ;
    }
    shouldRenderCategory(channelId) {
        const categoryChannels = ChannelListStore.getGuild(GuildUtils.currentId)?.guildChannels.categories[channelId]?.channels ?? {};
        for (const channelId of Object.keys(categoryChannels)) {
            const shouldRender = this.shouldRenderChannel(channelId);
            if (shouldRender) {
                return true;
            }
        }
        return false;
    }
    getAllHiddenChannels() {
        return Object.keys(this.current.channels).reduce((acc, channelId) => {
            const channel = ChannelStore.getChannel(channelId);
            if (!channel)
                return acc;
            acc[channelId] = channel;
            return acc;
        }, {});
    }
    getHiddenChannels(guildId) {
        const channels = GuildChannelStore
            .getChannels(guildId)
            .SELECTABLE
            .map(stored => stored.channel);
        return {
            channels: channels
                .filter(channel => this.isHidden(channel.id))
                .reduce((acc, channel) => {
                acc[channel.id] = channel;
                return acc;
            }, {}),
            guilds: {
                [guildId]: this.current.guilds[guildId]
            }
        };
    }
    getHiddenChannelsArray(guildId) {
        return Object
            .keys(this.getHiddenChannels(guildId).channels)
            .map(channelId => ChannelStore.getChannel(channelId)?.name)
            .sort();
    }
    restartVisibilityTimer(channelId) {
        const hiddenChannel = this.current.channels[channelId];
        if (!hiddenChannel)
            return;
        if (hiddenChannel.stayVisibleTimeout)
            clearTimeout(hiddenChannel.stayVisibleTimeout);
        hiddenChannel.stayVisibleTimeout = setTimeout(() => {
            this.update({
                [channelId]: {
                    hidden: true,
                    hadActivity: false,
                }
            });
        }, Settings.current.keepChannelVisibleAfterActivityTimeoutMin * 60 * 1000);
    }
    hasActiveTimer(channelId) {
        const hiddenChannel = this.current.channels[channelId];
        return !!(hiddenChannel?.stayVisibleTimeout || hiddenChannel?.hadActivity);
    }
    clearVisibilityTimer(channelId) {
        const hiddenChannel = this.current[channelId];
        if (!hiddenChannel)
            return;
        if (hiddenChannel.stayVisibleTimeout)
            clearTimeout(hiddenChannel.stayVisibleTimeout);
        this.updateChannelState(channelId, {
            stayVisibleTimeout: undefined,
            hadActivity: false,
        });
    }
    stayVisisbleTimeout(channelId, isUnread) {
        const hiddenChannel = this.current[channelId];
        if (!hiddenChannel)
            return;
        const { hidden, hadActivity, stayVisibleTimeout } = hiddenChannel;
        if (isUnread && hidden) {
            clearTimeout(stayVisibleTimeout);
            this.updateChannelState(channelId, {
                hadActivity: true,
                hidden: false,
            });
        }
        else if (!isUnread && hadActivity) {
            this.restartVisibilityTimer(channelId);
        }
    }
};
DanhoStores.register(HiddenChannelStore);

const ScrollerStore = new class GuildChannelListScrollerStore extends DiumStore {
    constructor() {
        super({}, 'GuildChannelListScrollerStore');
    }
    getInstance() {
        const currentGuildId = GuildUtils.currentId;
        return {
            update: (scrollTop) => currentGuildId ? this.update({ [currentGuildId]: scrollTop }) : null,
            getScrollState: () => this.current[currentGuildId] ?? 0,
        };
    }
};
DanhoStores.register(ScrollerStore);

const DISCORD_HEADER_CHANNEL_NAV_SECTION_ID = 1;
function GuildList(ListClass) {
    const guild = GuildUtils.current;
    const guildFeatures = GuildUtils.useGuildFeatures(guild);
    return class DanhoGuildChannelList extends ListClass {
        componentDidMount() {
            this.updateScroll();
            super.componentDidMount();
            this.timeout = setTimeout(() => {
                this.updateHeight();
            });
        }
        componentDidUpdate(prevProps, prevState, snapshot) {
            this.updateScroll();
            super.componentDidUpdate(prevProps, prevState, snapshot);
        }
        componentWillUnmount() {
            super.componentWillUnmount();
            if (this.timeout)
                clearTimeout(this.timeout);
        }
        constructor(props) {
            super(props);
            this.instanceRef = React.createRef();
            this.timeout = null;
            this._scrollState = ScrollerStore.getInstance();
            this.__originalRenderRow = 'renderRow' in this ? this.renderRow : undefined;
            this.renderRow = this.patchedRenderRow.bind(this);
            this.__originalGetRowHeight = 'getRowHeight' in this ? this.getRowHeight : undefined;
            this.getRowHeight = this.patchedGetRowHeight.bind(this);
            this.__originalRenderSection = 'renderSection' in this ? this.renderSection : undefined;
            this.renderSection = this.patchedRenderSection.bind(this);
            this.handleListScroll = this.onScroll.bind(this);
            HiddenChannelStore.addListener(state => {
                const guild = state.guilds[props.guild.id];
                if (guild)
                    this.forceUpdate();
            });
        }
        render() {
            return (React.createElement("div", { className: ScrollerLooks.thin, style: {
                    overflow: 'hidden scroll',
                    maxHeight: '100%',
                }, onScroll: this.onScroll.bind(this), ref: this.instanceRef }, super.render()));
        }
        onScroll(e) {
            if (!e)
                return;
            this._scrollState.update(e.currentTarget.scrollTop);
        }
        updateScroll() {
            if (this.instanceRef.current) {
                this.instanceRef.current.scrollTop = this._scrollState.getScrollState();
            }
        }
        updateHeight() {
            const channelsList = $(s => s.ariaLabel('Channels', 'ul'));
            channelsList.setStyleProperty('height', 'auto');
            const userArea = $(s => s.ariaLabel('User area', 'section').and.className('panels'));
            const userAreaHeight = userArea?.element.clientHeight ? `${userArea.element.clientHeight}px` : '1rem';
            channelsList.setStyleProperty('paddingBottom', `calc(${userAreaHeight} + 0px)`);
        }
        patchedRenderRow(rowData) {
            const { section, row } = rowData;
            const channelResult = this.runOriginalChecks(section, row, () => this.__originalRenderRow(rowData), true);
            if (!this.isChannelResult(channelResult))
                return channelResult;
            const { channel } = channelResult;
            return HiddenChannelStore.shouldRenderChannel(channel.id)
                ? this.__originalRenderRow(rowData)
                : null;
        }
        patchedRenderSection(data) {
            const rendered = this.__originalRenderSection(data);
            if (!rendered.key.includes('category'))
                return rendered;
            const categoryChannelId = rendered.key.split('-').pop();
            return HiddenChannelStore.shouldRenderChannel(categoryChannelId) ? rendered : null;
        }
        patchedGetRowHeight(section, row) {
            const channelResult = this.runOriginalChecks(section, row, () => this.__originalGetRowHeight(section, row));
            if (!this.isChannelResult(channelResult))
                return channelResult;
            const { channel } = channelResult;
            return HiddenChannelStore.shouldRenderChannel(channel.id)
                ? this.__originalGetRowHeight(section, row)
                : 0;
        }
        runOriginalChecks(section, row, original, runPlaceholderCheck = false) {
            const { guild } = this.props;
            const channelList = ChannelListStore.getGuild(guild.id, guildFeatures);
            if (section === DISCORD_HEADER_CHANNEL_NAV_SECTION_ID)
                return original();
            else if (runPlaceholderCheck && channelList.guildChannels.isPlaceholderRow(section, row))
                return original();
            const channelResult = channelList.guildChannels.getChannelFromSectionRow(section, row);
            if (!channelResult)
                return original();
            return channelResult;
        }
        isChannelResult(result) {
            return typeof result === 'object' && result !== null && 'channel' in result;
        }
    };
}

const styles$2 = ".danho-guild-channels-list {\n  max-height: calc(100vh - 10rem);\n  overflow-y: auto;\n}";

function Feature$8() {
    if (!Settings.current.hideChannelUntilActivity)
        return;
    HiddenChannelStore.load();
    ScrollerStore.load();
    const module = Finder.findBySourceStrings("GuildChannelList", { defaultExport: false });
    after(module, 'E', ({ result, args: [props] }) => {
        after(result, 'type', ({ result, args: [props] }) => {
            const efParent = result.props.children.props.children;
            const efChild = result.props.children.props.children.props.children;
            const ef = efChild.type;
            const DanhoGuildList = GuildList(ef);
            efParent.props.children = React.createElement(DanhoGuildList, { ...efChild.props });
        }, { silent: true });
        return result;
    }, { name: 'GuildChannelList' });
}

const HideInactiveChannels = {
    __proto__: null,
    default: Feature$8,
    styles: styles$2
};

const GuildHeader = Finder.findBySourceStrings("hasCommunityInfoSubheader()", "ANIMATED_BANNER", "header");

const MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false });

function Feature$7() {
    if (!Settings.current.showGuildMembersInHeader)
        return;
    if (!GuildHeader)
        return Logger.error("Failed to find header memo");
    if (!MemberListItem)
        return Logger.error("Failed to find MemberListItem");
}

const ShowGuildMembersInHeader = {
    __proto__: null,
    default: Feature$7
};

const { focused } = byKeys(['focused', 'item', 'labelContainer']);
const SortByAuthorOption = ({ sortOptionClone, orderPostsByAuthor }) => {
    const [className, dispatch] = useReducer((state, action) => {
        switch (action) {
            case 'hover': return `${state} ${focused}`;
            case 'default': return state.replace(focused, '').trim();
            default: return state;
        }
    }, sortOptionClone.className);
    return (React.createElement("div", { "data-custom-option": true, className: className, onMouseOver: () => dispatch('hover'), onMouseOut: () => dispatch('default'), style: { maxHeight: '1rem', }, onClick: orderPostsByAuthor }, Array.from(sortOptionClone.children).map(child => {
        if (child.className.includes('label'))
            child.textContent = 'Author';
        return renderChildren([child], { style: { maxHeight: '1rem', } });
    })));
};

async function addSortByAuthorOnDOM() {
    const sortGroup = await observeAppMountFor(() => $('#sort-and-view')?.children(s => s.ariaLabel('Sort by').and.role('group'), true), 5000, 'Sort group not found or took too long');
    if (typeof sortGroup === 'string')
        return error(sortGroup);
    if (sortGroup.children('.bdd-wrapper').length)
        return;
    sortGroup.children('li').forEach(el => el.on('click', () => $('[data-custom-option] circle').unmount()));
    const sortOptionClone = sortGroup.lastChild.element.cloneNode(true);
    sortOptionClone.querySelector('circle')?.remove();
    sortGroup.appendHtml('<></>').lastChild.replaceWithComponent(React.createElement(SortByAuthorOption, { sortOptionClone, orderPostsByAuthor }));
    log('Sort by author added to DOM');
}
function orderPostsByAuthor() {
    const postsContainer = $(s => s.role('list').and.dataIncludes('list-id', 'forum-channel-list'))?.children(undefined, true);
    if (!postsContainer)
        return error('Posts not found');
    const posts = postsContainer.children('li').reduce((acc, post) => {
        const author = post.children(s => s.className('author').className('username'), true);
        if (!author.element)
            return acc;
        const authorName = author.value.toString();
        if (!authorName) {
            error('Author not found', post);
            return acc;
        }
        return acc.set(authorName, [...(acc.get(authorName) ?? []), post]);
    }, new Map());
    if (!posts.size)
        return error('No posts found');
    const sortedAuthors = Array.from(posts.keys()).sort();
    postsContainer.children('li').forEach(post => post.unmount());
    sortedAuthors.forEach(author => postsContainer.appendElements(posts.get(author)));
    $('#sort-and-view')
        .children('.bdd-wrapper svg', true)
        .appendElements([$('#sort-and-view').children('circle', true).element]);
    $(s => s.id('sort-and-view').role('group').and.ariaLabel('Sort by'))
        .children('circle')
        .forEach((el) => {
        if (el.ancestor('.bdd-wrapper'))
            return;
        el.unmount();
    });
}

function addSortAndViewButtonClick() {
    if (!testForumChannel())
        return;
    const sortAndViewButton = $(s => s.ariaLabel('Sort & view').and.type('button'));
    sortAndViewButton?.on('click', addSortByAuthorOnDOM);
    debugLog(sortAndViewButton ? 'Sort and view button found' : 'Sort and view button not found');
}
function testForumChannel() {
    const [_blank, _channelsString, _guildId, channelId] = window.location.pathname.split('/');
    const channel = ChannelStore.getChannel(channelId);
    if (!channel)
        return false;
    return channel.type === 15 ;
}

function Feature$6() {
    if (!Settings.current.allowForumSortByAuthor)
        return;
    addSortAndViewButtonClick();
}

const SortForumsByAuthor = {
    __proto__: null,
    default: Feature$6
};

const BirthdayStore = new class BirthdayStore extends DiumStore {
    constructor() {
        super({}, 'BirthdayStore');
    }
    isBirthdayChild(userResolvable) {
        const user = typeof userResolvable === 'object' ? userResolvable : UserStore$1.getUser(userResolvable);
        if (!user) {
            warn(`User not found for ${userResolvable}`);
            return false;
        }
        const date = this.current[user.id] ? new Date(this.current[user.id]) : null;
        if (!date)
            return false;
        const now = new Date();
        const sameDay = date.getDate() === now.getDate();
        const sameMonth = date.getMonth() === now.getMonth();
        return sameDay && sameMonth;
    }
};
DanhoStores.register(BirthdayStore);

const style$4 = "span[class*=timestamp] {\n  color: var(--text-primary);\n}\n\nli.danho-birthday-calendar {\n  display: flex;\n  align-items: center;\n  margin-left: 8px;\n  border-radius: 4px;\n}\nli.danho-birthday-calendar > * {\n  padding: 8px;\n}\nli.danho-birthday-calendar svg {\n  margin-left: 4px;\n  margin-right: 12px;\n}\n\ndiv:has(> .birthday-child-icon) {\n  position: relative;\n}\n\n.birthday-child-icon {\n  z-index: 1;\n  position: absolute;\n  top: -0.3ch;\n  right: -0.5ch;\n  font-size: 1.4ch;\n}";

function Feature$5() {
    if (!Settings.current.showBirthdayOnNameTag)
        return null;
    BirthdayStore.load();
    log('[BirthdayStore] Loaded birthday data', BirthdayStore.current);
}

const UserBirthday = {
    __proto__: null,
    default: Feature$5,
    style: style$4
};

const UserTimezoneStyle = "span[class*=timestamp] {\n  color: var(--text-primary);\n}";

const DiscordEnhancements = [
    ShowGuildMembersInHeader,
    SortForumsByAuthor,
    FixRelativeTimestamps,
    UserBirthday,
    { style: UserTimezoneStyle, default: () => { } },
    HideInactiveChannels,
    DirectAndGroupTabs,
];

const style$3 = ".custom-badge-container .users, .custom-badge-container .potential-users {\n  scrollbar-width: thin;\n  scrollbar-color: var(--primary-500) var(--primary-560);\n}\n\n.badge-context-option-container, .custom-badge-container {\n  display: flex;\n  place-items: center;\n  gap: 0.5ch;\n}\n\n.custom-badge-container {\n  display: grid;\n  grid-template-columns: 5rem 1fr;\n  gap: 1em;\n  padding: 0.5em;\n  margin: 0.5em 0;\n  border-radius: 0.25em;\n}\n.custom-badge-container--alternate {\n  background-color: var(--primary-600);\n}\n.custom-badge-container img[class*=badge] {\n  --size: 4rem;\n  width: var(--size);\n  height: var(--size);\n}\n.custom-badge-container .custom-badge-info {\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  gap: 1ch;\n}\n.custom-badge-container .users {\n  overflow: auto hidden;\n  display: flex;\n  gap: 1ch;\n}\n.custom-badge-container .potential-users {\n  overflow: hidden auto;\n  max-height: 10rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1em;\n}\n.custom-badge-container .potential-users .potential-user {\n  padding: 0.5em;\n  border-radius: 0.25em;\n}\n\n.custom-badge-modify-container {\n  padding: 0.75em 0;\n  margin: 1em 0;\n  border: 1px solid var(--primary-500);\n  border-inline: none;\n}\n.custom-badge-modify-container .searchable-list__items {\n  --min: 12rem;\n}\n.custom-badge-modify-container .button-panel {\n  justify-content: end;\n}\n\n.danho-discord-user:has(.danho-user-badge-list) .danho-discord-user__avatar {\n  --size: 3rem;\n}\n\n.danho-user-badge-list {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 0.25ch;\n}\n.danho-user-badge-list img[class*=badge] {\n  --size: 20px;\n  width: var(--size);\n  height: var(--size);\n}\n\n.position-input {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5ch;\n  align-items: center;\n}\n\n.custom-badge-list ul {\n  --min: 1fr;\n}\n\n.create-new-badge-button {\n  min-width: max-content;\n}";

function Feature$4() {
    if (!Settings.current.badges)
        return;
    if (Settings.current.useClientCustomBadges)
        CustomBadgesStore.load();
    DiscordBadgeStore.load();
    BadgePositionsStore.load();
}

const Badges = {
    __proto__: null,
    default: Feature$4,
    style: style$3
};

const style$2 = ".bdd-wrapper:has(#secret-channel-login) {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  background-color: var(--background-primary);\n  height: 100%;\n  width: 100%;\n  z-index: 9999;\n}\n\n#secret-channel-login {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n}\n\ndiv:has(> #secret-channel-login) {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}";

const LockHello = {
    __proto__: null,
    style: style$2
};

function handleHiding() {
    const status = UserUtils.me.status;
    const isHiding = status === 'invisible';
    const { isHidingOnPurpose } = Settings.current;
    if (isHidingOnPurpose && !isHiding)
        Settings.update({ isHidingOnPurpose: false });
    else if (!isHidingOnPurpose && isHiding) {
        const close = BdApi.UI.showNotice(`You appear to be hiding... Is this on purpose?`, {
            buttons: [
                {
                    label: 'Yes, stay hidden',
                    onClick: () => {
                        Settings.update({ isHidingOnPurpose: true });
                        close();
                    }
                },
                {
                    label: 'No, get me back online',
                    onClick: () => {
                        if (!UserStatusActions.dispatch)
                            return BdApi.UI.showToast('Could not find dispatcher', { type: 'error' });
                        UserStatusActions.dispatch('online', status, undefined, undefined);
                        close();
                    }
                },
            ]
        });
    }
}

function Feature$3() {
    if (!Settings.current.wakeUp)
        return;
    handleHiding();
}

const WakeUp = {
    __proto__: null,
    default: Feature$3
};

const DanhoEnhancements = [
    Badges,
    LockHello,
    WakeUp,
];

const style$1 = ".danho-expand-bio-again div[class*=descriptionClamp] {\n  display: block !important;\n  max-height: unset !important;\n}\n.danho-expand-bio-again button[class*=viewFullBio] {\n  display: none !important;\n}";

function Feature$2() {
    if (!Settings.current.expandBioAgain)
        return;
    $('#app-mount').addClass('danho-expand-bio-again');
}

const ExpandBioAgain = {
    __proto__: null,
    default: Feature$2,
    styles: style$1
};

const style = ".danho-non-obnoxious-profile-effects [class*=profileEffects]:hover {\n  opacity: 0.2;\n}";

function Feature$1() {
    if (!Settings.current.nonObnoxiousProfileEffects)
        return;
    $('#app-mount').addClass('danho-non-obnoxious-profile-effects');
}

const NonObnoxiousProfileEffects = {
    __proto__: null,
    default: Feature$1,
    styles: style
};

const prettyRoles$1 = "*[role=list][data-list-id*=roles] > div div:has([class*=roleRemoveButton][role=button]),\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveButton][role=button],\n*[role=list][data-list-id*=roles] > div [class*=roleFlowerStar],\n*[role=list][data-list-id*=roles] > div [class*=roleCircle] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n}\n\n*[role=list][data-list-id*=roles] {\n  padding: 1rem;\n}\n*[role=list][data-list-id*=roles]:has(.danho-colorful-roles__group-role) div:has([class*=expandButton]) {\n  flex: 1 1 50%;\n}\n\n*[role=list][data-list-id*=roles] > div {\n  --role-color--default: rgb(86, 105, 118);\n  --role-color: var(--role-color--default);\n  --role-color-alpha: .125;\n  position: relative;\n  border: 1px solid rgb(var(--role-color, --role-color--default));\n  background-color: rgba(var(--role-color, --role-color--default), var(--role-color-alpha));\n  border-radius: 0.25rem;\n  height: 25px;\n  box-sizing: border-box;\n  justify-content: center;\n}\n*[role=list][data-list-id*=roles] > div [class*=roleCircle],\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveIcon] {\n  height: 100%;\n  width: 100%;\n}\n*[role=list][data-list-id*=roles] > div span[class*=roleCircle] {\n  background-color: unset !important;\n}\n*[role=list][data-list-id*=roles] > div svg[class*=roleRemoveIcon] {\n  display: none;\n}\n*[role=list][data-list-id*=roles] > div div:has(svg[class*=linkIcon]) {\n  position: absolute;\n  top: -0.5rem;\n  left: -0.75rem;\n}\n*[role=list][data-list-id*=roles] > div:hover svg[class*=linkIcon] {\n  display: inline-block !important;\n}\n\n.danho-colorful-roles__group-role {\n  flex: 1 1 100% !important;\n  margin-inline: -1rem;\n}";

const PrettyRoles = {
    __proto__: null,
    styles: prettyRoles$1
};

const PrivateChannelSidebarList = Finder.findBySourceStrings("PrivateChannels", "storeLink", { defaultExport: false });

const styles$1 = ".danho-ui-rework-fix div[class*=channelBottomBarArea] {\n  margin-top: 0.5rem;\n}\n.danho-ui-rework-fix div[class*=channelTextArea] {\n  --custom-chat-input-margin-bottom: 24px;\n}\n.danho-ui-rework-fix [data-list-id=guildsnav] *[class*=icon] {\n  border-radius: 50% !important;\n}\n.danho-ui-rework-fix [data-list-id=guildsnav] div[class*=selected] *[class*=icon] {\n  border-radius: 25% !important;\n  transition: border-radius 300ms;\n  transition-delay: 100ms;\n}\n.danho-ui-rework-fix .danho-nav-group {\n  display: grid;\n  grid-auto-flow: column;\n}\n.danho-ui-rework-fix .danho-nav-group:has([class*=interactive]:hover) > * {\n  margin-right: 1ch;\n}\n.danho-ui-rework-fix .danho-nav-group div[class*=interactive]:hover div[class*=content] {\n  display: block;\n}\n.danho-ui-rework-fix .danho-nav-group div[class*=interactive] a[class*=link]:not([class*=interactive]:hover a[class*=link]) {\n  padding-inline: 0;\n}\n.danho-ui-rework-fix .danho-nav-group div[class*=avatarWithText] {\n  justify-content: center;\n  gap: 1ch;\n}\n.danho-ui-rework-fix .danho-nav-group div[class*=avatarWithText] div[class*=avatar] {\n  margin-right: 0;\n}\n.danho-ui-rework-fix .danho-nav-group div[class*=avatarWithText] div[class*=content] {\n  display: none;\n}\n.danho-ui-rework-fix button[class*=button] {\n  border-radius: 3px;\n}\n\nhtml[class*=visual-refresh]:has(.danho-ui-rework-fix) {\n  --custom-channel-textarea-text-area-height: 2.75rem;\n  --custom-rtc-account-height: 2.5rem;\n}\nhtml[class*=visual-refresh]:has(.danho-ui-rework-fix) section[class*=panels] {\n  bottom: calc(var(--space-xs) * 1.5);\n}";

function Feature() {
    const { uiReworkFix, removePrivateSearchButton, groupPrivateChannelNavOptions } = Settings.current;
    if (!uiReworkFix)
        return;
    $('#app-mount').addClass('danho-ui-rework-fix');
    if (removePrivateSearchButton || groupPrivateChannelNavOptions) {
        after(PrivateChannelSidebarList, 'Z', ({ result }) => {
            after(result.type, 'type', ({ result }) => {
                if (groupPrivateChannelNavOptions) {
                    const navOptions = result.props.children[1].props.children;
                    const dividerIndex = navOptions.findIndex(child => child?.key.includes('divider'));
                    const [divider] = navOptions.splice(dividerIndex, 1);
                    const replacedChildren = [
                        React.createElement("div", { className: 'danho-nav-group' }, navOptions),
                        divider
                    ];
                    result.props.children[1].props.children = replacedChildren;
                }
                if (Settings.current.removePrivateSearchButton)
                    result.props.children.shift();
            }, { silent: true });
        }, { once: true, name: 'PrivateChannelSidebarList' });
    }
}

const UiReworkFix = {
    __proto__: null,
    default: Feature,
    styles: styles$1
};

const StyleChanges = [
    ExpandBioAgain,
    NonObnoxiousProfileEffects,
    PrettyRoles,
    UiReworkFix,
];

const features = [
    ...DiscordEnhancements,
    ...DanhoEnhancements,
    ...StyleChanges,
];
const Features = () => features.forEach(feature => 'default' in feature && feature.default());
const styles = features.map(feature => 'styles' in feature ? feature.styles
    : 'style' in feature ? feature.style
        : '').join("\n\n");

const DUNGEON_GUILD_ID = '460926327269359626';
const HELLO_CHANNEL_ID = '1303419756572835930';

const LOGIN_ID = 'secret-channel-login';
function Login({ onSubmit }) {
    function handleSubmit(e) {
        e.preventDefault();
        const password = e.currentTarget.password.value;
        onSubmit(password);
    }
    return (React.createElement("form", { id: LOGIN_ID, onSubmit: handleSubmit },
        React.createElement(Text, null, "This channel is locked. Please enter the password to access it."),
        React.createElement("div", { className: 'form-group' },
            React.createElement(FormItem$1, { title: 'Password' }),
            React.createElement("input", { type: "password", name: "password" })),
        React.createElement(Button$1, { type: "submit" }, "Login")));
}

class ChannelLock {
    static instance(stayUnlockedForMinutes, initialState = false) {
        if (!this._instance || this._instance._timeoutDuration !== stayUnlockedForMinutes * 60 * 1000) {
            return this._instance = new ChannelLock(stayUnlockedForMinutes, initialState);
        }
        return this._instance;
    }
    constructor(stayUnlockedForMinutes, initialState) {
        this._locked = initialState;
        this._timeoutDuration = stayUnlockedForMinutes * 60 * 1000;
    }
    get isLocked() {
        return this._locked;
    }
    lock() {
        this._locked = true;
    }
    unlock() {
        this._locked = false;
        if (this._timeout)
            clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            if (!this._locked)
                this._locked = true;
        }, this._timeoutDuration);
    }
}
ChannelLock._instance = null;

let debouncedLoginRemover;
const LockChannels = createActionCallback('CHANNEL_SELECT', async ({ channelId, guildId }) => {
    if (!channelId
        || !guildId
        || guildId !== DUNGEON_GUILD_ID
        || channelId !== HELLO_CHANNEL_ID) {
        if (debouncedLoginRemover)
            clearTimeout(debouncedLoginRemover);
        if (document.getElementById(LOGIN_ID))
            debouncedLoginRemover = setTimeout(() => document.getElementById(LOGIN_ID)?.parentElement.remove(), 100);
        return;
    }
    await wait(() => { }, 1);
    const contentContainer = $(`[class*='content']:has(> main[class*='chatContent'])`);
    if (!contentContainer)
        return log(`Could not find content container`, {
            get contentContainer() {
                return $(`[class*='content']:has(> main[class*='chatContent'])`);
            }
        });
    const Lock = ChannelLock.instance(Settings.current.lockUnlockForMinutes, Settings.current.initialLockState);
    if (Lock.isLocked)
        contentContainer.insertComponent('afterbegin', React.createElement(Login, { onSubmit: password => {
                const correct = password === Settings.current.lockPassword;
                if (!correct)
                    return BdApi.UI.showToast('Incorrect password', { type: 'error' });
                $(`#${LOGIN_ID}`).parent.unmount();
                Lock.unlock();
            } }));
});

const RegisterSortByAuthorOptionInForums = createActionCallback('CHANNEL_SELECT', async () => {
    await sleep(1000);
    addSortAndViewButtonClick();
});

function onChannelSelect() {
    if (!Settings.current.lockChannels
        || !Settings.current.allowForumSortByAuthor)
        return;
    ActionsEmitter.on('CHANNEL_SELECT', data => {
        if (Settings.current.lockChannels)
            LockChannels(data);
        if (Settings.current.allowForumSortByAuthor)
            RegisterSortByAuthorOptionInForums(data);
    });
}

const RelationshipActions = Finder.findBySourceStrings("cancelFriendRequest", "addRelationship", "removeRelationship");

const CancelFriendRequest = createActionCallback('RELATIONSHIP_ADD', ({ relationship }) => {
    const blockFolderNames = Settings.current.folderNames;
    const blockFolders = SortedGuildStore.getGuildFolders().filter(folder => blockFolderNames.includes(folder.folderName));
    if (blockFolders.length === 0)
        return;
    const cancelFriendRequest = () => {
        RelationshipActions.cancelFriendRequest(relationship.user.id, 'friends');
        const message = `Blocked friend request from ${relationship.user.username} (${relationship.user.id}) because they are in a blocked folder`;
        log(message);
        BdApi.UI.showToast(message, { type: 'success' });
    };
    const mutualGuildIds = UserProfileStore.getMutualGuilds(relationship.user.id)?.map(v => v.guild.id);
    if (mutualGuildIds === undefined) {
        const mutualFriends = UserProfileStore.getMutualFriends(relationship.user.id);
        if (!mutualFriends?.length)
            cancelFriendRequest();
        return;
    }
    else if (mutualGuildIds.length === 0)
        return;
    const mutualGuildIdsInBlockFolders = mutualGuildIds.filter(guildId => blockFolders.some(folder => folder.guildIds.includes(guildId)));
    if (mutualGuildIdsInBlockFolders.length === 0)
        return;
    else if (mutualGuildIdsInBlockFolders.length !== mutualGuildIds.length)
        return;
});

function onRelationshipAdd$1() {
    if (!Settings.current.autoCancelFriendRequests
        || Settings.current.folderNames.length === 0)
        return;
    ActionsEmitter.on('RELATIONSHIP_ADD', data => {
        if (Settings.current.autoCancelFriendRequests)
            CancelFriendRequest(data);
    });
}

const PrettyRolesManager = new class PrettyRolesManager {
    getRole(roleId) {
        return this.context?.roles.find(r => r.id === roleId) ?? GuildUtils.getGuildRoleWithoutGuildId(roleId);
    }
    removeRole() {
        if (!this.role)
            return;
        this.context?.onRemoveRole(this.role);
    }
    canRemoveRole() {
        if (!this.role)
            return false;
        return this.context.guild.ownerId === this.context.currentUser.id
            || (this.context.canManageRoles && this.context.highestRole.id !== this.role.id);
    }
};

async function prettyRoles() {
    await sleep(100);
    $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
        const roleId = el.attr('data-list-item-id')?.split('_').pop();
        if (!roleId)
            return;
        const role = PrettyRolesManager.getRole(roleId);
        if (!role)
            return Logger.warn('Role not found', roleId);
        el.setStyleProperty('--role-color', hexToRgb(role.colorString
            ?? role.colorStrings?.primaryColor
            ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number))).join(','));
        if (Settings.current.groupRoles) {
            const isGroupRole = role.name.toLowerCase().includes('roles');
            if (isGroupRole)
                el.addClass('danho-colorful-roles__group-role');
        }
    });
}

function onRelationshipAdd() {
    if (!Settings.current.prettyRoles)
        return;
    ActionsEmitter.on('USER_PROFILE_MODAL_OPEN', ({ guildId }) => {
        if (Settings.current.prettyRoles && guildId)
            prettyRoles();
    });
}

class JoinWithCameraManager {
    static get instance() {
        return this._instance ??= new JoinWithCameraManager();
    }
    constructor() {
        this._shouldEnableCamera = false;
    }
    get() {
        return {
            channelId: this._channelId,
            shouldEnableCamera: this._shouldEnableCamera,
        };
    }
    set(channelId, shouldEnableCamera) {
        this._channelId = channelId;
        this._shouldEnableCamera = shouldEnableCamera;
    }
    reset() {
        this._channelId = undefined;
        this._shouldEnableCamera = false;
    }
}

async function joinWithCamera(channelId) {
    JoinWithCameraManager.instance.set(channelId, true);
    if (RTCConnectionStore.isDisconnected()
        || RTCConnectionStore.getRTCConnection?.().channelId !== channelId) {
        VoiceActions.handleVoiceConnect({ channelId });
    }
    else
        enableCamera();
}
const onVoiceChannelSelect$1 = createActionCallback('VOICE_CHANNEL_SELECT', ({ channelId: selectedChannelId, currentVoiceChannelId }) => {
    const { channelId, shouldEnableCamera } = JoinWithCameraManager.instance.get();
    if (selectedChannelId !== channelId || !shouldEnableCamera)
        return;
    JoinWithCameraManager.instance.reset();
    enableCamera();
});
function enableCamera() {
    const preferredWebcamId = MediaEngineStore.getVideoDeviceId();
    if (!preferredWebcamId) {
        BdApi.UI.showToast("No preferred webcam set", { type: "error" });
        $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
        return;
    }
    VoiceActions.setVideoDevice(preferredWebcamId);
    VoiceActions.setVideoEnabled(true);
}

function onVoiceChannelSelect() {
    if (!Settings.current.joinVoiceWithCamera)
        return;
    ActionsEmitter.on('VOICE_CHANNEL_SELECT', data => {
        if (Settings.current.joinVoiceWithCamera)
            onVoiceChannelSelect$1(data);
    });
}

function listenToActions() {
    onChannelSelect();
    onRelationshipAdd$1();
    onRelationshipAdd();
    onVoiceChannelSelect();
}

const createPatcherCallback = (callback) => callback;
const createPatcherAfterCallback = (callback) => callback;
const createPatcherCallback$1 = createPatcherCallback;

function movePremiumBeforeBoost(props) {
    const nitroBadge = props.children.find(badge => badge.props.children.props.href?.includes(BadgeTypes.NITRO_ANY));
    const boosterBadgePos = props.children.findIndex(badge => typeof badge.props.text === 'string' && badge.props.text.toLowerCase().includes('boost'));
    if (!nitroBadge && boosterBadgePos === -1)
        return props;
    props.children.splice(props.children.indexOf(nitroBadge), 1);
    props.children.splice(boosterBadgePos - 1, 0, nitroBadge);
    return props;
}

function insertBadges(props, result) {
    if (!result || result.props.children.some(badge => badge.type === CustomBadge))
        return;
    const badges = result.props.children;
    const { customBadges, users } = CustomBadgesStore.current;
    const user = props.displayProfile
        ? UserStore.getUser(props.displayProfile.userId)
        : UserUtils.getUserByUsername(getUsername());
    if (!user)
        return;
    const badgeWithIds = Array.from(badges).map(instance => {
        const badge = DiscordBadgeStore.findBadgeByUrl(instance.props.children.props.children.props.src, instance);
        if (!badge)
            Logger.warn(`Failed to find badge in DiscordBadgesStore`, instance);
        return {
            id: badge?.id,
            instance: instance,
        };
    }).filter(Boolean);
    const userCustomBadgeIds = Object.entries(customBadges)
        .filter(([_, { userTags }]) => userTags
        ? userTags.includes(user.username)
        : true)
        .map(([badgeId]) => badgeId);
    const userPreferredBadges = (user.id in users ? users[user.id] : []);
    const compiledBadges = BadgePositionsStore.sort([
        ...badgeWithIds.map(badge => badge.id),
        ...userPreferredBadges,
        ...userCustomBadgeIds,
    ]).map(badgeId => {
        const realBadge = badgeWithIds.find(badge => badge.id === badgeId);
        if (realBadge)
            return realBadge.instance;
        const discordBadge = badgeId in DiscordBadgeStore.current ? DiscordBadgeStore.current[badgeId] : null;
        if (discordBadge)
            return React.createElement(CustomBadge, { key: badgeId, iconUrl: UrlUtils.badgeIcon(discordBadge.icon), name: DiscordBadgeStore.getBadgeName(badgeId), href: discordBadge.link });
        const customBadge = badgeId in customBadges ? customBadges[badgeId] : null;
        if (customBadge)
            return React.createElement(CustomBadge, { key: badgeId, ...customBadge });
        Logger.warn(`Failed to find badge in CustomBadgesStore`, badgeId);
        return null;
    });
    result.props.children = compiledBadges;
}
function getUsername() {
    return $(s => s.role('dialog').className('userTag'))?.value.toString()
        ?? $(s => s.className('userProfileOuter').className('userTag'))?.value.toString()
        ?? $(s => s.className('accountProfileCard').className('usernameInnerRow'), false)
            .map(dq => dq.children(undefined, true).value.toString())[1];
}

const modifyBadges = createPatcherAfterCallback(({ args: [props], result }) => {
    if (Settings.current.movePremiumBadge)
        movePremiumBeforeBoost(result.props);
    insertBadges(props, result);
});

function afterBadgeList() {
    if (!Settings.current.badges)
        return;
    after(BadgeList, 'Z', data => {
        if (Settings.current.badges)
            modifyBadges(data);
    }, { name: 'BadgeList' });
}

const ChannelItem = Finder.findBySourceStrings("tutorialId", "visible", "shouldShow", { defaultExport: false });

const HOME_CHANNEL_ID = '1266581800428245094';

const addJoinWithCameraDoubleClick = createPatcherAfterCallback(({ args: [props] }) => {
    if (!props.children?.props?.children?.[1]?.props?.channel)
        return;
    const channel = props.children.props.children[1].props.channel;
    if (!channel || channel.id !== HOME_CHANNEL_ID)
        return;
    const { className, 'data-dnd-name': dndName } = props.children.props;
    const node = $(s => s.className(className).and.data('dnd-name', dndName));
    node?.on('dblclick', (e) => {
        e.preventDefault();
        joinWithCamera(HOME_CHANNEL_ID);
    });
});

function afterChannelItem() {
    if (!Settings.current.joinVoiceWithCamera)
        return;
    after(ChannelItem, 'Z', (...args) => {
        if (Settings.current.joinVoiceWithCamera)
            addJoinWithCameraDoubleClick(...args);
    }, { name: 'ChannelItem' });
}

const CalendarIcon = Finder.findBySourceStrings("M7 1a1 1 0 0 1 1 1v.75c0");

const DanhoBirthdayCalendarKey = "danho-birthday-calendar";
const BIRTHDAY_REGEX = /\d{1,2}\/\d{1,2}(\/(\d{4}|\d{2}))?/;
function getBirthdate(birthdate) {
    const now = new Date();
    const [day, month, year] = birthdate
        .split('/')
        .map((value, index) => Number(value) + (value.length === 2 && index === 2
        ? now.getFullYear() - 2000 > Number(value) ? 2000 : 1900
        : 0));
    return new Date(year || now.getFullYear(), month - 1, day);
}

let selectedClassName = null;
function useBirthdayNavProps(props) {
    const globalNav = $(s => s.ariaLabel('Direct Messages', 'ul'));
    useEffect(() => {
        globalNav.children().forEach(child => {
            child.on('click', props.onSiblingClick);
        });
    }, []);
    const firstNavItem = globalNav.children('li', true);
    if (!firstNavItem.element)
        return null;
    const clickableProps = firstNavItem.children(undefined, true).props;
    const result = {
        listItemProps: exclude(firstNavItem.props, 'children', 'onBlur', 'onClick', 'onFocus'),
        selectedClassName: getSelectedClassName(),
        clickableProps: Object.assign({}, clickableProps, {
            className: clickableProps.className
                .split(' ')
                .filter(className => !className.includes('selected'))
                .join(' '),
            onClick: (e) => {
                globalNav.children('li').forEach(listItem => {
                    listItem.children(`.${getSelectedClassName()}`)
                        .forEach(child => child.removeClass(getSelectedClassName()));
                });
                props.onClick(e);
            }
        })
    };
    return result;
}
function getSelectedClassName() {
    log('SelectedClassName requested: ', selectedClassName);
    return selectedClassName ||= $(s => s.ariaLabel('Direct Messages', 'ul'))
        .children(s => s.className('selected'), true)
        .props?.className
        .split(' ')
        .filter((className) => className.includes('selected'))
        .join(' ');
}

function CalendarPage() {
    const friends = RelationshipStore.getFriendIDs();
    const friendBirthdays = friends
        .map(userId => Object.assign({}, UserNoteStore.getNote(userId), { userId }))
        .filter(noteState => !noteState.loading && BIRTHDAY_REGEX.test(noteState.note))
        .map(noteStateData => ({
        birthdate: getBirthdate(noteStateData.note.match(BIRTHDAY_REGEX)[0]),
        userId: noteStateData.userId
    }));
    return (React.createElement("div", { className: "calendar-page" },
        React.createElement(Text, { variant: "heading-md/medium", style: { color: 'var(--text-primary);' } }, "Hello, World!"),
        React.createElement("br", null),
        React.createElement("ul", null, friendBirthdays.map(({ userId, birthdate }) => (React.createElement("li", { key: userId },
            React.createElement("img", { src: UserStore.getUser(userId)?.getAvatarURL(), alt: UserStore.getUser(userId)?.username ?? userId }),
            React.createElement(TimestampComponent, { format: "D", unix: birthdate.getTime() / 1000 })))))));
}

function BirthdayCalendarNavItem() {
    const [selected, setSelected] = useState(false);
    const props = useBirthdayNavProps({
        onClick: () => {
            setSelected(true);
            renderCalendarPage();
        },
        onSiblingClick: () => setSelected(false)
    });
    return (React.createElement("li", { ...props?.listItemProps ?? {}, className: classNames(selected ? props?.selectedClassName : props?.listItemProps.className, 'danho-birthday-calendar'), key: DanhoBirthdayCalendarKey },
        React.createElement(Clickable, { ...props?.clickableProps },
            React.createElement(CalendarIcon, null),
            React.createElement(Text, null, "Birthdays"))));
}
function renderCalendarPage() {
    const sidebar = $(s => s.className('base').className('content').className('sidebar'));
    const base = sidebar.parent;
    const children = base.children(undefined);
    children.shift();
    children.forEach(child => child.unmount());
    base.appendComponent(React.createElement(CalendarPage, null));
}

const addToGlobalNav = createPatcherAfterCallback(({ result }) => {
    const navItems = result.props.children.props.children;
    if (navItems.some(i => i?.key === DanhoBirthdayCalendarKey))
        return;
    navItems.splice(navItems.length, 0, React.createElement(BirthdayCalendarNavItem, null));
});

function afterGlobalNavigation() {
    if (!Settings.current.showBirthdayCalendar)
        return;
    after(GlobalNavigation, 'Z', (data) => {
        if (Settings.current.showBirthdayCalendar)
            addToGlobalNav(data);
    }, { name: 'GlobalNavigation' });
}

const updateGuildHeader = createPatcherAfterCallback(({ args: [props] }) => {
    let showGuildMembers = $('.danho-lib__header-members', false);
    if (showGuildMembers.length >= 1)
        return;
    const guild = GuildStore.getGuild(props.guildId);
    if (!guild)
        return;
    const members = GuildMemberStore.getMembers(guild.id);
    const presenceState = PresenceStore.getState();
    const nonOfflineMembers = members.filter(member => presenceState.statuses[member.userId] && presenceState.statuses[member.userId] !== 'offline');
    const header = $(s => s.className('container', 'nav').and.ariaLabel(`${guild.name} (server)`)
        .className('header', 'header'));
    if (!header)
        return;
    header.appendComponent(React.createElement(Text, { variant: "heading-md/normal" },
        nonOfflineMembers.length,
        "/",
        members.length), { className: 'danho-lib__header-members' });
    setTimeout(() => {
        showGuildMembers = $('danho-lib__header-members', false);
        if (showGuildMembers.length > 1) {
            showGuildMembers.shift();
            showGuildMembers.forEach(e => e.unmount());
        }
    }, 100);
});

const applyBirthdayIconOnMemberListItem = createPatcherAfterCallback(({ result: _result, args: [props] }) => {
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
});

function afterMemberListItem() {
    if (!Settings.current.showGuildMembersInHeader)
        return;
    after(MemberListItem, 'Z', (data) => {
        if (Settings.current.showGuildMembersInHeader)
            updateGuildHeader(data);
        if (Settings.current.showBirthdayOnNameTag)
            applyBirthdayIconOnMemberListItem(data);
    }, { name: 'MemberListItem' });
}

const NameTag = Finder.findBySourceStrings(`nameAndDecorators`, `AvatarWithText`);

const applyBirthdayIconOnNameTag = createPatcherAfterCallback(({ result, args: [props] }) => {
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
});

function afterNameTag() {
    if (!Settings.current.showBirthdayOnNameTag)
        return;
    after(NameTag, 'render', (...args) => {
        if (Settings.current.showBirthdayOnNameTag)
            applyBirthdayIconOnNameTag(...args);
    }, { name: 'NameTag' });
}

class SortableArray extends Array {
    constructor(...items) {
        super(...items);
    }
    orderBy(...comparators) {
        const result = this.sort((a, b) => {
            for (const comparator of comparators) {
                const result = comparator(a, b);
                if (result !== 0)
                    return result;
            }
            return 0;
        });
        return new SortableArray(...result);
    }
    orderByDescending(...comparators) {
        const result = this.orderBy(...comparators.map(comparator => (a, b) => -comparator(a, b)));
        return new SortableArray(...result);
    }
    take(count) {
        const result = this.slice(0, count);
        return new SortableArray(...result);
    }
}

const redefineQuickSwitcherProps = createPatcherAfterCallback(({ result, ...props }) => {
    const { query } = result;
    const log$1 = (...data) => log('[CustomizedQuickSwitcher]', ...data);
    let { channels, guilds, users } = {
        guilds: SortedGuildStore.guildIds.map(GuildStore.getGuild),
        users: RelationshipStore.getFriendIDs().map(UserStore.getUser),
        channels: SortedGuildStore.guildIds
            .flatMap(ChannelStore.getChannelIds)
            .map(ChannelStore.getChannel)
            .filter(channel => [2 , 0 ].includes(channel.type))
    };
    log$1('Initial data', { channels, guilds, users });
    guilds = guilds.filter(guild => guild.name.toLowerCase().includes(query.toLowerCase()));
    users = new SortableArray(...users
        .filter(user => [user.globalName, user.username]
        .filter(Boolean)
        .some(name => name.toLowerCase().includes(query.toLowerCase())))).orderBy((a, b) => (RelationshipStore.isFriend(a.id) && !RelationshipStore.isFriend(b.id)
        ? -1
        : RelationshipStore.isFriend(b.id) && !RelationshipStore.isFriend(a.id)
            ? 1
            : 0), (a, b) => a.globalName?.localeCompare(b.globalName) || a.username.localeCompare(b.username)).take(10);
    const allChannels = channels
        .filter(channel => channel.name.toLowerCase().includes(query.toLowerCase()));
    channels = new SortableArray(...allChannels)
        .orderBy((a, b) => a.name.localeCompare(b.name), (a, b) => guilds.indexOf(GuildStore.getGuild(a.guild_id)) - guilds.indexOf(GuildStore.getGuild(b.guild_id))).take(10);
    log$1('Filtered data', { channels, guilds, users });
    const isUserRequest = query.startsWith('@');
    const isTextChannelRequest = query.startsWith('#');
    const isVoiceChannelRequest = query.startsWith('!');
    const isGuildRequest = query.startsWith('*');
    if (isUserRequest) {
        result.results = users.map((user, index) => ({
            type: 'USER',
            record: user,
            comparator: user.username,
            score: index + 1000
        }));
        return;
    }
    else if (isTextChannelRequest) {
        result.results = Object.values(channels).filter(channel => channel.type === 0 ).map((channel, index) => ({
            type: 'TEXT_CHANNEL',
            record: channel,
            comparator: channel.name,
            score: index + 1000
        }));
        return;
    }
    else if (isVoiceChannelRequest) {
        result.results = Object.values(channels).filter(channel => channel.type === 2 ).map((channel, index) => ({
            type: 'VOICE_CHANNEL',
            record: channel,
            comparator: channel.name,
            score: index + 1000
        }));
        return;
    }
    else if (isGuildRequest) {
        result.results = Object.values(guilds).map((guild, index) => ({
            type: 'GUILD',
            record: guild,
            comparator: guild.name,
            score: index + 1000
        }));
        return;
    }
    const combined = [
        ...users.map((user, index) => ({
            type: 'USER',
            record: user,
            comparator: user.username,
            score: index + 1000,
            index
        })),
        ...channels.map((channel, index) => ({
            type: channel.type === 0  ? 'TEXT_CHANNEL' : 'VOICE_CHANNEL',
            record: channel,
            comparator: channel.name,
            score: index + 1000,
            sortable: channel.name,
            guildName: GuildStore.getGuild(channel.guild_id).name,
            index
        })),
        ...guilds.map((guild, index) => ({
            type: 'GUILD',
            record: guild,
            comparator: guild.name,
            score: index + 1000,
            sortable: guild.name,
            index
        }))
    ].sort((a, b) => a.score - b.score);
    log('CustomizedQuickSwitcher', {
        query,
        users,
        channels,
        guilds,
        combined,
    });
    result.results = combined;
});

function afterQuickSwitcherStore_getProps() {
    if (!Settings.current.betterQuickSwitcher)
        return;
    after(QuickSwitcherStore, 'getProps', (data) => {
        if (Settings.current.betterQuickSwitcher)
            redefineQuickSwitcherProps(data);
    }, { name: 'QuickSwitcherStore.getProps()' });
}

const RolesListModule = demangle({
    RolesList: bySource$1('onAddRole')
}, null, true);

function afterRolesList$1() {
    if (!Settings.current.prettyRoles)
        return;
    after(RolesListModule, 'RolesList', () => {
        if (Settings.current.prettyRoles)
            prettyRoles();
    });
}

const TextModule = Finder.findBySourceStrings('lineClamp', 'tabularNumbers', 'scaleFontToUserSetting');

const transformTextIntoLinks = createPatcherAfterCallback(({ args: [props], result }) => {
    const { className, children: text } = props;
    if (!className || !className.includes('pronounsText'))
        return;
    const regex = text.match(/\w{2}\.pronouns\.page\/@(\w+)/);
    if (!regex)
        return;
    const [matched] = regex;
    result.props.children = (React.createElement("a", { href: `https://${matched}`, target: "_blank", rel: "noreferrer noopener" }, matched));
});

function afterTextModule() {
    if (!Settings.current.pronounsPageLinks)
        return;
    after(TextModule, 'render', (data) => {
        if (Settings.current.pronounsPageLinks)
            transformTextIntoLinks(data);
    }, { name: 'TextModule--Pronouns' });
}

const UserActivityStatus = Finder.findBySourceStrings("PresenceActivityStatus", "textVariant", { defaultExport: false });

var ActivityIndexes;
(function (ActivityIndexes) {
    ActivityIndexes[ActivityIndexes["PLAYING"] = 0] = "PLAYING";
    ActivityIndexes[ActivityIndexes["STREAMING"] = 1] = "STREAMING";
    ActivityIndexes[ActivityIndexes["LISTENING"] = 2] = "LISTENING";
    ActivityIndexes[ActivityIndexes["WATCHING"] = 3] = "WATCHING";
    ActivityIndexes[ActivityIndexes["CUSTOM"] = 4] = "CUSTOM";
    ActivityIndexes[ActivityIndexes["COMPETING"] = 5] = "COMPETING";
})(ActivityIndexes || (ActivityIndexes = {}));

const expandActivityStatusString = createPatcherAfterCallback(({ result, args: [props] }) => {
    if (props.activity.type !== ActivityIndexes.LISTENING)
        return;
    const { details: title, state: artistsString, } = props.activity;
    if (!title || !artistsString)
        return;
    const artists = StringUtils.join(artistsString.split(";"));
    try {
        const children = result.props.children[1]
            ? result.props.children[1].props.children
            : result.props.children;
        children[1] = typeof children[1] !== 'object' ? children[1] : (React.createElement("span", null,
            React.createElement("strong", null, title),
            " by ",
            React.createElement("strong", null, artists)));
    }
    catch (err) {
        Logger.error(err, {
            result, props, title, artists,
        });
    }
});

function afterRolesList() {
    if (!Settings.current.expandActivityStatus)
        return;
    after(UserActivityStatus, 'Z', (data) => {
        if (Settings.current.expandActivityStatus)
            expandActivityStatusString(data);
    });
}

const UserHeaderUsernameModule = bySource([".pronouns", "discriminatorClass"], { resolve: false });

function Birthday(props) {
    const { birthdate } = props;
    const { hideTimestamp = false, hideIcon = false, timestampStyle = 'T' } = props;
    const birthdateDate = useMemo(() => getBirthdate(birthdate), [birthdate]);
    const BirthdateContent = () => (React.createElement("span", { className: "birthdate" },
        React.createElement(TimestampComponent, { format: timestampStyle, unix: birthdateDate.getTime() / 1000 }),
        ",",
        React.createElement(TimestampComponent, { format: "R", unix: birthdateDate.getTime() / 1000 })));
    const BirthdateComponent = (props = {}) => (React.createElement("div", { className: "birthday", ...props },
        !hideIcon && React.createElement("span", { className: "birthday-icon" }, "\uD83C\uDF82"),
        !hideTimestamp && React.createElement(BirthdateContent, null)));
    return (hideTimestamp
        ? React.createElement(Tooltip, { text: React.createElement(BirthdateContent, null), children: BirthdateComponent })
        : React.createElement(BirthdateComponent, null));
}

function BirthdayContainer({ birthdate }) {
    const settings = Settings.useSelector(state => ({
        hideIcon: state.hideBirthdateIcon,
        hideTimestamp: state.hideBirthdateTimestamp,
        timestampStyle: state.birthdateTimestampStyle
    }));
    return React.createElement(Birthday, { birthdate: birthdate, ...settings });
}

const appendUserBirthday = createPatcherAfterCallback(({ result, args: [props] }) => {
    const noteData = UserNoteStore.getNote(props.user.id);
    if (!noteData?.note)
        return result;
    const { note } = noteData;
    const match = note.match(BIRTHDAY_REGEX);
    if (!match)
        return result;
    const [birthdate] = match;
    if (BirthdayStore.current[props.user.id]?.toString() !== getBirthdate(birthdate).toString()) {
        BirthdayStore.update({ [props.user.id]: getBirthdate(birthdate).toString() });
        log(`[BirthdayStore (appendUserBirthday)] Added birthday for ${props.user.id}`);
    }
    const children = result.props.children[1].props.children;
    children.splice(children.length, 0, React.createElement(BirthdayContainer, { birthdate: birthdate }));
});

function Timezone(props) {
    const { timezoneHour } = props;
    const { hideTimestamp = false, hideIcon = false } = props;
    const getTimezoneDate = useCallback(() => {
        const date = new Date();
        date.setHours(date.getHours() + timezoneHour);
        return date;
    }, [timezoneHour]);
    const [timezoneDate, setTimezoneDate] = useState(getTimezoneDate);
    const timezoneIcon = useMemo(() => {
        if (hideIcon)
            return null;
        const clocks = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'];
        return clocks[(timezoneDate.getHours() % 12)];
    }, [hideIcon, timezoneHour]);
    useEffect(() => {
        const interval = setInterval(() => setTimezoneDate(getTimezoneDate), 1000 * 60);
        return () => clearInterval(interval);
    }, []);
    const TimezoneComponent = (props = {}) => (React.createElement("div", { className: "timezone", ...props },
        !hideIcon && React.createElement("span", { className: "timezone-icon" }, timezoneIcon),
        !hideTimestamp && React.createElement(TimestampComponent, { format: 't', unix: timezoneDate.getTime() / 1000 })));
    return (hideTimestamp
        ? React.createElement(Tooltip, { text: React.createElement(TimestampComponent, { format: 't', unix: timezoneDate.getTime() / 1000 }), children: TimezoneComponent })
        : React.createElement(TimezoneComponent, null));
}

function TimezoneContainer({ timezoneHour }) {
    const settings = Settings.useSelector(state => ({
        hideIcon: state.hideTimezoneIcon,
        hideTimestamp: state.hideTimezoneTimestamp
    }));
    return React.createElement(Timezone, { timezoneHour: timezoneHour, ...settings });
}

const appendUserTimezone = createPatcherAfterCallback(({ result, args: [props] }) => {
    const noteData = UserNoteStore.getNote(props.user.id);
    if (!noteData?.note)
        return result;
    const { note } = noteData;
    const regex = /\[(\+|\-)(\d{1,2})\]/;
    const match = note.match(regex);
    if (!match)
        return result;
    const [, sign, hours] = match;
    const timezone = parseInt(hours) * (sign === '+' ? 1 : -1);
    const children = result.props.children[1].props.children;
    children.splice(children.length, 0, React.createElement(TimezoneContainer, { timezoneHour: timezone }));
});

function afterUserHeaderUsername() {
    after(UserHeaderUsernameModule, 'Z', data => {
        if (Settings.current.showUserTimezone)
            appendUserTimezone(data);
        if (Settings.current.showUserBirthdate)
            appendUserBirthday(data);
    }, { name: 'UserHeaderUsernameModule' });
}

const patched$4 = function (menu, props) {
    const options = menu.props.children;
    const voiceOptions = options.find(option => (option.key
        && option.key.toLowerCase().includes('voice')
        && option.key.toLowerCase().includes('actions')));
    if (!voiceOptions)
        return;
    voiceOptions.props.children.unshift(buildTextItemElement("join-with-camera", "Join with Camera", () => joinWithCamera(props.channel.id)));
};

const menuItemIds = [
    'opt-into-channel',
    'opt-out-category',
];
const patched$3 = (menu, props) => {
    const visibilityOptions = menuItemIds.map(id => getGroupContaining(id, menu)).find(Boolean);
    if (!visibilityOptions)
        return;
    const optIndex = visibilityOptions.findIndex(item => menuItemIds.includes(item.props.id));
    const hideElement = buildTextItemElement('hide-until-active', 'Hide until active', () => HiddenChannelStore.hideChannel(props.channel.id));
    const unhideElement = buildTextItemElement('unhide-until-active', 'Unhide until active', () => HiddenChannelStore.showChannel(props.channel.id));
    visibilityOptions.splice(optIndex + 1, 0, HiddenChannelStore.isHidden(props.channel.id) ? unhideElement : hideElement);
};

function PatchChannelContextMenu() {
    const { joinVoiceWithCamera, hideChannelUntilActivity } = Settings.current;
    if (!joinVoiceWithCamera || !hideChannelUntilActivity)
        return;
    PatchChannelContextMenu$1((...args) => {
        if (joinVoiceWithCamera)
            patched$4(...args);
        if (hideChannelUntilActivity)
            patched$3(...args);
    });
}

const patched$2 = function (menu, props) {
    if (!('folderName' in props))
        return;
    const isInBlockedFolder = Settings.current.folderNames.includes(props.folderName);
    menu.props.children.push(buildTextItemElement('danho-block-friend-requests', isInBlockedFolder ? 'Unblock friend requests' : 'Block friend requests', () => {
        Settings.update(cur => ({
            ...cur, folderNames: isInBlockedFolder
                ? cur.folderNames.filter(v => v !== props.folderName)
                : [...cur.folderNames, props.folderName]
        }));
    }, { color: 'danger' }));
};

const patched$1 = (menu, props) => {
    if (!('guild' in props))
        return;
    const visibilityOptions = getGroupContaining('hide-muted-channels', menu);
    if (!visibilityOptions)
        return;
    visibilityOptions.push(buildCheckboxItemElement('show-hidden-channels', 'Show Hidden Channels', HiddenChannelStore.showsHiddenChannels(props.guild.id), () => HiddenChannelStore.showsHiddenChannels(props.guild.id)
        ? HiddenChannelStore.hideHiddenChannels(props.guild.id)
        : HiddenChannelStore.showHiddenChannels(props.guild.id)));
};

function PatchGuildContextMenu() {
    const { autoCancelFriendRequests, hideChannelUntilActivity } = Settings.current;
    if (!autoCancelFriendRequests && !hideChannelUntilActivity)
        return;
    PatchGuildContextMenu$1((...args) => {
        if (autoCancelFriendRequests)
            patched$2(...args);
        if (hideChannelUntilActivity)
            patched$1(...args);
    });
}

function modifyRoleContextMenu(result) {
    if (!PrettyRolesManager.context)
        return result;
    const roleId = result.props.children.props.id.split('-').pop();
    const role = PrettyRolesManager.getRole(roleId);
    PrettyRolesManager.role = role;
    if (!PrettyRolesManager.canRemoveRole())
        return result;
    result.props.children = [
        React.createElement(MenuGroup, null,
            React.createElement(MenuItem, { color: 'danger', id: "pretty-roles__remove-role", label: `Remove role`, action: () => {
                    PrettyRolesManager.removeRole();
                } })),
        result.props.children,
    ];
    return result;
}

function afterRoleContextMenu() {
    if (!Settings.current.prettyRoles)
        return;
    contextMenu('dev-context', result => {
        if (Settings.current.prettyRoles)
            modifyRoleContextMenu(result);
    });
}

let unpatchOverride = () => { };
const patch = () => createContextMenuCallback('user', (menu, props, unpatch) => {
    const profile = UserProfileStore.getUserProfile(props.user.id);
    if (!profile)
        return;
    const modifyBadges = ContextMenuUtils.getGroupContaining('modify-badges', menu);
    if (modifyBadges)
        return;
    const userActions = ContextMenuUtils.getGroupContaining('user-profile', menu);
    if (!userActions)
        return;
    const DiscordBadges = DiscordBadgeStore.current;
    const CustomUser = CustomBadgesStore.current.users[props.user.id] ?? [];
    userActions.push(buildSubMenuElement('modify-badges', 'Modify Badges', [
        ...Object.entries(BadgeGroups).map(([group, badges]) => (buildSubMenu(`${group}-badges`, StringUtils.pascalCaseFromSnakeCase(group), badges.map((badgeId) => {
            const badge = DiscordBadges[badgeId];
            const name = `${DiscordBadgeStore.getBadgeName(badgeId)} ${badgeId.includes('boost') ? `level ${badgeId.split('').pop()}` : ''}`;
            return buildCheckboxItem(badgeId, CustomBadge
                ? React.createElement("div", { className: 'badge-context-option-container' },
                    React.createElement(CustomBadge, { name: name, iconUrl: UrlUtils.badgeIcon(badge.icon), href: badge.link, key: badgeId }),
                    name)
                : name, CustomUser?.includes(badgeId), (checked) => {
                const badges = CustomUser;
                if (checked && !badges.includes(badgeId))
                    badges.push(badgeId);
                else if (!checked && badges.includes(badgeId))
                    badges.splice(badges.indexOf(badgeId), 1);
                else
                    Logger.warn('Badge already exists or does not exist', { badgeId, current: badges, checked });
                CustomBadgesStore.update(current => ({
                    ...current,
                    users: {
                        ...current.users,
                        [props.user.id]: badges,
                    },
                }));
            });
        })))),
        buildSeparator(),
        buildSubMenu("custom-badges", "Custom Badges", Object.entries(CustomBadgesStore.current.customBadges)
            .sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
            .map(([id, badge]) => (buildCheckboxItem(id, React.createElement("div", { className: 'badge-context-option-container' },
            React.createElement(CustomBadge, { name: badge.name, iconUrl: badge.iconUrl, href: badge.href, key: id }),
            badge.name), badge.userTags?.includes(props.user.username) ?? false, (checked) => {
            const userTag = props.user.username;
            const userTags = badge.userTags ?? new Array();
            if (checked && !userTags.includes(userTag))
                userTags.push(userTag);
            else if (!checked && userTags.includes(userTag))
                userTags.splice(userTags.indexOf(userTag), 1);
            else
                Logger.warn('Badge already exists or does not exist', { userTag, current: userTags, checked });
            CustomBadgesStore.update(current => ({
                ...current,
                customBadges: {
                    ...current.customBadges,
                    [id]: {
                        ...badge,
                        userTags
                    },
                },
            }));
        }))))
    ]));
    unpatchOverride = unpatch;
});
CustomBadgesStore.addListener(() => {
    unpatchOverride();
    if (Settings.current.useClientCustomBadges)
        PatchUserContextMenu$1(patch());
});
const addModifyBadgesToUserContextMenu = patch();

const DEADLY_NINJA_ID = '405763731079823380';
const DUNGEON_ID = '760145289956294716';

function hasPermission(channel, userId, accessPermissions) {
    if (!accessPermissions)
        return false;
    const userPermissions = channel.permissionOverwrites[userId]?.allow ?? 0n;
    return BigInt(userPermissions & accessPermissions) === accessPermissions;
}

const patched = function (menu, props) {
    const isGuildContextMenu = !!props.guildId;
    if (!isGuildContextMenu)
        return menu;
    const guild = GuildStore.getGuild(props.guildId);
    if (guild.id !== DEADLY_NINJA_ID)
        return menu;
    const memberIds = GuildMemberStore.getMemberIds(guild.id);
    const dungeon = GuildChannelStore.getChannels(guild.id).VOCAL.find(stored => stored.channel.id === DUNGEON_ID)?.channel;
    if (!dungeon)
        return menu;
    const accessPermission = dungeon.accessPermission ?? 1049600n;
    if (typeof accessPermission !== "bigint") {
        console.error("Invalid accessPermission value", accessPermission);
        return menu;
    }
    const permittedUsers = memberIds
        .map(UserStore.getUser)
        .filter(Boolean)
        .filter(user => hasPermission(dungeon, user.id, accessPermission));
    if (!permittedUsers.length)
        return menu;
    const hasAccess = permittedUsers.some(user => user.id === props.user.id);
    const allow = (userId) => ({
        allow: accessPermission,
        deny: 0n,
        id: userId,
        type: 1,
    });
    menu.props.children[0].props.children[5].props.children.push(buildTextItemElement(hasAccess ? "remove-from-dungeon" : "add-to-dungeon", hasAccess ? "Remove from Dungeon" : "Add to Dungeon", () => {
        if (hasAccess)
            PermissionActions.clearPermissionOverwrite(DUNGEON_ID, props.user.id);
        else
            PermissionActions.updatePermissionOverwrite(DUNGEON_ID, allow(props.user.id));
    }));
};

function PatchUserContextMenu() {
    if (!Settings.current.addToDungeon && !Settings.current.useClientCustomBadges)
        return;
    PatchUserContextMenu$1((...args) => {
        if (Settings.current.addToDungeon)
            patched(...args);
        if (Settings.current.useClientCustomBadges)
            addModifyBadgesToUserContextMenu(...args);
    });
}

function extendSortedGuildStore() {
    const updateGuildIds = () => {
        SortedGuildStore.guildIds = SortedGuildStore.getGuildFolders()
            .map(folder => folder.guildIds)
            .flat();
    };
    const actionDependencies = [
        'GUILD_CREATE', 'GUILD_DELETE',
        'GUILD_MOVE_BY_ID',
        'GUILD_FOLDER_CREATE_LOCAL', 'GUILD_FOLDER_EDIT_LOCAL', 'GUILD_FOLDER_DELETE_LOCAL',
    ];
    for (const action of actionDependencies) {
        ActionsEmitter.on(action, updateGuildIds);
    }
    updateGuildIds();
}

function registerExtensions() {
    extendSortedGuildStore();
}

const setManagerContext = createPatcherCallback$1(({ args, original }) => {
    const result = original.__originalFunction(...args);
    if (result)
        PrettyRolesManager.context = result.props;
    return result;
});

function insteadRolesList() {
    if (!Settings.current.prettyRoles)
        return;
    instead(RolesListModule, 'RolesList', (data) => {
        if (Settings.current.prettyRoles)
            return setManagerContext(data);
        return data.original(...data.args);
    });
}

function Patch() {
    registerExtensions();
    PatchChannelContextMenu();
    PatchGuildContextMenu();
    afterRoleContextMenu();
    PatchUserContextMenu();
    afterBadgeList();
    afterChannelItem();
    afterGlobalNavigation();
    afterMemberListItem();
    afterNameTag();
    afterQuickSwitcherStore_getProps();
    afterRolesList$1();
    afterTextModule();
    afterRolesList();
    afterUserHeaderUsername();
    insteadRolesList();
}

var SlashCommandOptionType;
(function (SlashCommandOptionType) {
    SlashCommandOptionType[SlashCommandOptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    SlashCommandOptionType[SlashCommandOptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    SlashCommandOptionType[SlashCommandOptionType["STRING"] = 3] = "STRING";
    SlashCommandOptionType[SlashCommandOptionType["INTEGER"] = 4] = "INTEGER";
    SlashCommandOptionType[SlashCommandOptionType["BOOLEAN"] = 5] = "BOOLEAN";
    SlashCommandOptionType[SlashCommandOptionType["USER"] = 6] = "USER";
    SlashCommandOptionType[SlashCommandOptionType["CHANNEL"] = 7] = "CHANNEL";
    SlashCommandOptionType[SlashCommandOptionType["ROLE"] = 8] = "ROLE";
})(SlashCommandOptionType || (SlashCommandOptionType = {}));
function createSlashCommand(options) {
    const pluginName = getMeta().name;
    return BdApi.Commands.register(pluginName, {
        id: `${pluginName}-${options.name}`,
        ...options,
    });
}
function deleteAllSlashCommands() {
    const pluginName = getMeta().name;
    BdApi.Commands.unregisterAll(pluginName);
}

const index = buildPlugin({
    start() {
        Features();
        listenToActions();
        Patch();
        createSlashCommand({
            name: 'show-discord-badges',
            execute: () => ({
                content: JSON.stringify(DiscordBadgeStore.current, null, 2)
            })
        });
    },
    stop() {
        ActionsEmitter.removeAllListeners();
        deleteAllSlashCommands();
    },
    styles,
    Settings,
    SettingsPanel,
});

module.exports = index;

/*@end @*/
