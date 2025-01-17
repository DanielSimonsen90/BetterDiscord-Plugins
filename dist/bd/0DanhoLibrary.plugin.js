/**
 * @name 0Danholibrary
 * @version 1.7.0
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
  "name": "0danholibrary",
  "description": "Library for Danho's plugins",
  "author": "danielsimonsen90",
  "version": "1.7.0",
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

const join = (...filters) => {
    return ((...args) => filters.every((filter) => filter(...args)));
};
const query$1 = ({ filter, name, keys, protos, source }) => join(...[
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
    join,
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
const byEntries = (...filters) => find$2(join(...filters.map((filter) => byEntry(filter))));
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

const patch = (type, object, method, callback, options) => {
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
const instead = (object, method, callback, options = {}) => patch("instead", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
const after = (object, method, callback, options = {}) => patch("after", object, method, (cancel, original, context, args, result) => callback({ cancel, original, context, args, result }), options);
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
const Logger = {
    ...diumLogger,
    debugLog,
};

const findBySourceStrings = (...keywords) => {
    const searchOptions = keywords.find(k => typeof k === 'object');
    if (searchOptions)
        keywords.splice(keywords.indexOf(searchOptions), 1);
    const backupIdKeyword = keywords.find(k => k.toString().startsWith('backupId='));
    const backupId = backupIdKeyword ? backupIdKeyword.toString().split('=')[1] : null;
    const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
    if (backupIdKeywordIndex > -1)
        keywords.splice(backupIdKeywordIndex, 1);
    if (backupId)
        log(`[findBySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);
    const showMultiple = keywords.find(k => k === 'showMultiple=true');
    const showMultipleIndex = keywords.indexOf(showMultiple);
    if (showMultipleIndex > -1)
        keywords.splice(showMultipleIndex, 1);
    if (showMultiple)
        log(`[findBySourceStrings] Showing multiple results - [${keywords.join(',')}]`, keywords);
    const moduleCallback = (exports, _, id) => {
        if (!exports || exports === window)
            return false;
        const eIsFunctionAndHasKeywords = typeof exports === 'function'
            && keywords.every(keyword => exports.toString().includes(keyword));
        if (eIsFunctionAndHasKeywords)
            return true;
        const eIsObject = Object.keys(exports).length > 0;
        const moduleIsMethodOrFunctionComponent = Object.keys(exports).some(k => typeof exports[k] === 'function'
            && keywords.every(keyword => exports[k].toString().includes(keyword)));
        const eIsObjectAsE = keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += exports[k]?.toString?.(), '').includes(keyword));
        const moduleIsObjectFromE = Object.keys(exports).some(k => exports[k] && typeof exports[k] === 'object'
            && keywords.every(keyword => Object.keys(exports[k])
                .reduce((acc, key) => acc += exports[k][key]?.toString?.(), '')
                .includes(keyword)));
        const moduleIsClassComponent = Object.keys(exports).some(k => typeof exports[k] === 'function'
            && exports[k].prototype
            && 'render' in exports[k].prototype
            && keywords.every(keyword => exports[k].prototype.render.toString().includes(keyword)));
        const moduleIsObjectOfObjects = Object.keys(exports).some(k => exports[k] && typeof exports[k] === 'object'
            && Object.keys(exports[k]).some(k2 => exports[k][k2] && typeof exports[k][k2] === 'object'
                && keywords.every(keyword => Object.keys(exports[k][k2])
                    .reduce((acc, k3) => exports[k][k2] === window ? acc : acc += exports[k][k2][k3]?.toString?.(), '')
                    .includes(keyword))));
        const eIsClassAsE = typeof exports === 'object' && 'constructor' in exports && keywords.every(keyword => exports.constructor.toString().includes(keyword));
        const eIsObjectWithKeywords = keywords.every(keyword => Object.keys(exports).reduce((acc, k) => acc += k + exports[k]?.toString?.(), '').includes(keyword));
        const filter = eIsObject ? (moduleIsMethodOrFunctionComponent
            || eIsObjectAsE
            || moduleIsClassComponent
            || moduleIsObjectFromE
            || moduleIsObjectOfObjects
            || eIsClassAsE
            || eIsObjectWithKeywords) : eIsFunctionAndHasKeywords;
        if ((filter && id !== backupId) || !filter && id === backupId)
            log(`[findBySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`, {
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
            log('Found by id', { exports, id });
        return filter;
    };
    const moduleSearchOptions = searchOptions ?? { searchExports: true };
    return showMultiple
        ? BdApi.Webpack.getModules(moduleCallback, moduleSearchOptions)
        : BdApi.Webpack.getModule(moduleCallback, moduleSearchOptions);
};
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
            }, { silent: true });
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
const Finder = {
    ...DiumFinder,
    ...BDFDB_Finder,
    findBySourceStrings,
    findComponentBySourceStrings
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
    default: Finder,
    demangle,
    find: find$2,
    findBySourceStrings,
    findComponentBySourceStrings,
    findWithKey,
    query,
    resolveKey,
    waitFor
};

const ChannelMemberStore = byName('ChannelMemberStore');

const ChannelStore = /* @__PURE__ */ byName("ChannelStore");
const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const GuildChannelStore = byKeys(["getTextChannelNameDisambiguations"]);

const GuildMemberStore = /* @__PURE__ */ byName("GuildMemberStore");
const SortedGuildStore = /* @__PURE__ */ byName("SortedGuildStore");
const ExpandedGuildFolderStore = /* @__PURE__ */ byName("ExpandedGuildFolderStore");

const GuildEmojiStore = byKeys(["getEmojis"]);

const GuildIdentyStore = byKeys(["saveGuildIdentityChanges"]);

const GuildStore = byName("GuildStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const PresenceStore = /* @__PURE__ */ byName("PresenceStore");

const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

const Dispatcher$1 = /* @__PURE__ */ byKeys(["dispatch", "subscribe"]);

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$1("Store", "connectStores"),
    Dispatcher: byProtos$1("dispatch"),
    Store: byProtos$1("emitChange"),
    BatchedStoreListener: byProtos$1("attach", "detach"),
    useStateFromStores: bySource$1("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);

const { React } = BdApi;
const classNames = /* @__PURE__ */ find$2((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const EventEmitter = /* @__PURE__ */ find$2((exports) => exports.prototype instanceof Object && Object.prototype.hasOwnProperty.call(exports.prototype, "prependOnceListener"));

const Common = /* @__PURE__ */ byKeys(["Button", "Switch", "Select"]);

const Button = Common.Button;

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const FormElements = {
    __proto__: null,
    FormDivider,
    FormItem,
    FormLabel,
    FormNotice,
    FormSection,
    FormSwitch,
    FormText,
    FormTitle
};

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

const { Menu, Group: MenuGroup, Item: MenuItem, Separator: MenuSeparator, CheckboxItem: MenuCheckboxItem, RadioItem: MenuRadioItem, ControlItem: MenuControlItem } = BdApi.ContextMenu;

const { Select, SingleSelect } = Common;

const { TextInput, InputError } = Common;

const Text = Common.Text;

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

const VoiceStore = byKeys(["getVoiceStateForUser"]);

const ApplicationStore = Finder.byName("ApplicationStore");

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

const MessageStore = byName("MessageStore");

const ThemeStore = byKeys(["theme"]);

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
            }).find(store => store.getName() === storeName);
}

const Stores = {
    __proto__: null,
    ApplicationStore,
    get AudioSubSystems () { return AudioSubSystems; },
    BetterProfileSettings,
    CameraComponent,
    ChannelMemberStore,
    ChannelStore,
    ContentInventoryStore,
    DiumStore,
    EmojiStore,
    ExpandedGuildFolderStore,
    GuildChannelStore,
    GuildEmojiStore,
    GuildIdentyStore,
    GuildMemberStore,
    GuildStore,
    MediaEngine,
    get MediaEngineContextTypes () { return MediaEngineContextTypes; },
    get MediaEngineEvent () { return MediaEngineEvent; },
    MediaEngineStore,
    MessageStore,
    PresenceStore,
    RelationshipStore,
    SelectedChannelStore,
    SelectedGuildStore,
    SortedGuildStore,
    get SupportedFeatures () { return SupportedFeatures; },
    ThemeStore,
    UserActivityStore,
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

const wait = (callback, time) => new Promise((resolve, reject) => {
    try {
        setTimeout(() => resolve(callback()), time);
    }
    catch (err) {
        reject(err);
    }
});

const UserNoteActions = byKeys(["updateNote"]);

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
};

const GuildActions = byKeys(["requestMembers"]);

const GuildUtils = {
    ...GuildStore,
    ...GuildMemberStore,
    ...GuildChannelStore,
    ...GuildEmojiStore,
    ...SelectedGuildStore,
    ...VoiceStore,
    ...GuildActions,
    get current() {
        return GuildStore.getGuild(SelectedGuildStore.getGuildId());
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
        const allGuildsRoles = GuildStore.getAllGuildsRoles();
        for (const guildId in allGuildsRoles) {
            if (allGuildsRoles[guildId][roleId]) {
                return allGuildsRoles[guildId][roleId];
            }
        }
        return null;
    },
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
    get currentUser() { return currentUser(); }
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

const DISPATCH_ACTIONS = Dispatcher$1._subscriptions;
function find(action) {
    return Object.keys(DISPATCH_ACTIONS).filter(key => key.toLowerCase().includes(action.toLowerCase()));
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
        this._events.set(eventName, this._events.get(eventName).filter(([l]) => l !== listener));
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
    UserNoteActions,
    find
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

const styles$1 = ".collapsible {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 1px solid var(--primary-500);\n  border-radius: 4px;\n  overflow: hidden;\n  margin: 1rem 0;\n}\n.collapsible__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 1rem;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.collapsible__header > span::after {\n  content: \"\";\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid var(--interactive-muted);\n  margin-left: 0.5rem;\n}\n.collapsible__header > span::after:hover {\n  border-top-color: var(--interactive-hover);\n}\n.collapsible__content {\n  padding: 0.5rem 1rem;\n  background-color: var(--background-secondary);\n  border-top: 1px solid var(--primary-500);\n}\n.collapsible__content.hidden {\n  display: none;\n}\n.collapsible[data-open=true] > .collapsible__header > span::after {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid var(--interactive-normal);\n}\n.collapsible[data-disabled=true] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.guild-list-item {\n  display: flex;\n  flex-direction: row;\n  font-size: 24px;\n  align-items: center;\n}\n.guild-list-item__icon {\n  --size: 2rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  margin-right: 1ch;\n}\n.guild-list-item__content-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 1rem;\n}\n.guild-list-item__name {\n  font-weight: bold;\n  color: var(--text-primary);\n}\n.guild-list-item__content {\n  color: var(--text-tertiary);\n}\n\n.custom-message {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 0.5ch;\n}\n.custom-message__avatar {\n  --size: 2.5rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  object-fit: cover;\n}\n.custom-message__main {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5ch;\n}\n.custom-message__main header {\n  display: flex;\n  align-items: center;\n  gap: 0.5ch;\n}\n.custom-message .user-mention, .custom-message .role-mention {\n  color: var(--mention-foreground);\n  background-color: var(--mention-background);\n}\n.custom-message .user-mention::before, .custom-message .role-mention::before {\n  content: \"@\";\n}\n.custom-message .channel-mention::before {\n  content: \"#\";\n}\n\n.progress-bar {\n  width: 100%;\n  height: 0.5rem;\n  border-radius: 0.5rem;\n  overflow: hidden;\n}\n.progress-bar__fill {\n  height: 100%;\n  background-color: var(--primary-600);\n  transition: width 0.3s;\n}\n\n.tab-bar {\n  max-width: 100%;\n}\n.tab-bar * {\n  color: var(--text-primary);\n  box-sizing: border-box;\n}\n\n.tab-bar__tabs {\n  display: grid;\n  grid-auto-flow: column;\n  max-width: 100%;\n  overflow-x: auto;\n}\n.tab-bar__tabs--no-color .tab-bar__tab {\n  background-color: transparent;\n  border: none;\n}\n\n.tab-bar__tab {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  border: none;\n  background-color: var(--primary-630);\n  color: var(--text-muted);\n  border: 1px solid var(--border-faint);\n  padding: 0.3rem 1rem;\n}\n.tab-bar__tab:hover {\n  background-color: var(--primary-600);\n  color: var(--text-primary);\n}\n.tab-bar__tab--active {\n  border: 1px solid var(--border-faint);\n  border-bottom: 1px solid var(--text-primary) !important;\n  color: var(--text-primary);\n}\n\n.tab-bar__content {\n  padding: 1em;\n  background-color: var(--primary-630);\n  border: 1px solid var(--border-faint);\n}\n.tab-bar__content--no-color {\n  background-color: transparent;\n  border: none;\n}\n.tab-bar__content-page:not(.tab-bar__content-page--active) {\n  opacity: 0;\n  z-index: -1;\n  pointer-events: none;\n  height: 0;\n}\n\n.danho-form-switch {\n  display: flex;\n  flex-direction: row-reverse;\n  align-items: center;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-form-select, .setting-group {\n  display: flex;\n  flex-direction: column-reverse;\n  gap: 0.5rem;\n  margin-top: 1rem;\n}\n\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.hidden {\n  display: none;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}";

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
        this.styles = styles$1;
    }
}
const LibraryPlugin = new DanhoLibrary();
window.DL = LibraryPlugin;
function buildPlugin(plugin) {
    const built = Object.assign({}, LibraryPlugin, plugin);
    built.styles = [LibraryPlugin.styles, plugin.styles].join('\n\n');
    return createPlugin(built);
}

const { useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState, useId, useDeferredValue, useInsertionEffect, useSyncExternalStore, useTransition, createRef, createContext, createElement, createFactory, forwardRef, cloneElement, lazy, memo, isValidElement, Component, PureComponent, Fragment, Suspense, } = React;

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
    if (type === 'select' && Array.isArray(settings[setting]))
        return (React.createElement("div", { className: "danho-form-select", key: setting.toString() },
            React.createElement(Select, { options: props.selectValues.map(value => ({ label: value, value })), isSelected: value => Array.isArray(settings[setting]) ? v.includes(value) : false, serialize: value => JSON.stringify(value), select: (value) => {
                    const selected = [...settings[setting]];
                    if (selected.includes(value))
                        selected.splice(selected.indexOf(value), 1);
                    else
                        selected.push(value);
                    set({ [setting]: selected });
                    setV(selected);
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
        return (React.createElement(React.Fragment, null, contentChildren.map(([tab, Content], key) => (React.createElement("div", { key: getKeyName(`content-${key}`), className: classNames("tab-bar__content-page", tab === (props.tab ?? activeTab) && 'tab-bar__content-page--active') },
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
    return (React.createElement("div", { id: props.id, className: classNames("tab-bar", props.className) },
        React.createElement("header", { className: classNames('tab-bar__tabs') },
            internalTabs.map(([tab, title]) => title &&
                React.createElement("button", { key: getKeyName(tab), className: classNames("tab-bar__tab", activeTab === tab && 'tab-bar__tab--active'), onClick: () => setActiveTab(tab) }, title)),
            props.children),
        React.createElement("section", { className: classNames('tab-bar__content') },
            React.createElement(TabContent, null))));
}

const renderChildren = (children, props = {}) => children.map(child => React.createElement(child.tagName, Array.from(child.attributes).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), props), child.outerHTML.match(/</g).length > 2 ? renderChildren(Array.from(child.children)) : child.textContent));

const UserBadges = Finder.BDFDB_findByStrings(['QUEST_CONTENT_VIEWED', '"PRESS_BADGE"', 'badgeClassName'], { defaultExport: false }).exports;
const RenderedUserProfileBadgeList = UserBadges;
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
    BadgeTypes["NITRO_FIRE"] = "premium_tenure_72_month";
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
    BadgeIconIds["premium_early_supporter"] = "7060786766c9c840eb3019e725d2b358";
    BadgeIconIds["quest_completed"] = "7d9ae358c8c5e118768335dbe68b4fb8";
    BadgeIconIds["staff"] = "5e74e9b61934fc1f67c65515d1f7e60d";
    BadgeIconIds["verified_developer"] = "6df5892e0f35b051f8b61eace34f4967";
})(BadgeIconIds || (BadgeIconIds = {}));

const USER_TAGS = {
    DANHO: 'danhosaur'
};
const DEFAULT_DISCORD_ROLE_COLOR = `153, 170, 181`;

const Settings = createSettings({
    prettyRoles: true,
    defaultRoleColor: DEFAULT_DISCORD_ROLE_COLOR,
    groupRoles: true,
    badges: true,
    movePremiumBadge: true,
    useClientCustomBadges: true,
    pronounsPageLinks: true,
    allowForumSortByAuthor: true,
    expandBioAgain: true,
    wakeUp: true,
    isHidingOnPurpose: false,
    autoCancelFriendRequests: true,
    folderNames: new Array(),
    showGuildMembersInHeader: true,
    addToDungeon: true,
    lockChannels: true,
    lockPassword: 'hello',
    lockUnlockForMinutes: 5,
    initialLockState: true,
    nonObnoxiousProfileEffects: true,
});
const titles = {
    prettyRoles: `Remove role circle, add more color to the roles`,
    defaultRoleColor: `Default role color`,
    groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,
    badges: `User badge modifications`,
    movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,
    useClientCustomBadges: `Use your own custom badges`,
    pronounsPageLinks: `Turn pronouns.page links into clickable links`,
    allowForumSortByAuthor: `Allow sorting forum posts by author`,
    expandBioAgain: `Expand the bio section again by default`,
    wakeUp: `Reminds you that you're hiding. Why are you hiding?`,
    isHidingOnPurpose: `User confirmed that they're hiding on purpose`,
    autoCancelFriendRequests: `Auto cancel friend requests on bigger servers`,
    folderNames: `Folder names that should block all incoming friend requests`,
    showGuildMembersInHeader: `Show guild members in the header`,
    addToDungeon: `"Add to / Remove from Dungeon" context menu on users in the Deadly Ninja server`,
    lockChannels: `Lock channels with a password`,
    lockPassword: `Password for locking channels`,
    lockUnlockForMinutes: `Minutes to lock channels for`,
    initialLockState: `Initial lock state for channels`,
    nonObnoxiousProfileEffects: `Lower the opacity of profile effects (on hover) so they aren't as obnoxious`,
};
const Badges$1 = createSettings({
    developer: {
        name: 'Plugin Developer',
        iconUrl: 'https://i.imgur.com/f5MDiAd.png',
        userTags: [USER_TAGS.DANHO],
        position: {
            before: BadgeTypes.ACTIVE_DEVELOPER,
            default: 0
        },
        size: '14px'
    },
});

function CreateSettingsGroup(callback) {
    return function SettingsGroup(props) {
        return callback(React, props, Setting, FormElements);
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

const PrettyRolesSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => (React.createElement(FormSection, { title: "PrettyRoles Settings" },
    React.createElement(Setting, { setting: "defaultRoleColor", type: "color", ...props, formatValue: rgbString => "#" + rgbToHex(rgbString.split(',').map(Number)), beforeChange: hex => hexToRgb(hex).join(',') }),
    React.createElement(Setting, { setting: "groupRoles", ...props }))));

const BadgesSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    return (React.createElement(FormSection, { title: "Badges Settings" },
        React.createElement(Setting, { setting: "movePremiumBadge", ...props }),
        React.createElement(Setting, { setting: "useClientCustomBadges", ...props })));
});

const AutoCancelFriendRequestSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    const folderNames = SortedGuildStore.getGuildFolders().map(folder => folder.folderName);
    return (React.createElement(FormSection, { title: "Auto Cancel Friend Request Settings" },
        React.createElement(Setting, { setting: "folderNames", type: 'select', selectValues: folderNames, ...props })));
});

const LockSettings = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
    return (React.createElement(FormSection, { title: "Lock Settings" },
        React.createElement(Setting, { setting: "lockPassword", ...props }),
        React.createElement(Setting, { setting: "lockUnlockForMinutes", ...props, type: "number" }),
        React.createElement(Setting, { setting: "initialLockState", ...props })));
});

function SettingsPanel() {
    const [settings, set] = Settings.useState();
    const tabs = Settings.useSelector(({ prettyRoles, badges, autoCancelFriendRequests }) => [
        ['prettyRoles', prettyRoles ? 'Pretty Roles' : null],
        ['badges', badges ? 'Badges' : null],
        ['autoCancelFriendRequests', autoCancelFriendRequests ? 'Auto Cancel Friend Requests' : null],
        ['lockChannels', settings.lockChannels ? 'Lock Channels' : null],
    ]);
    const settingProps = { settings, set, titles };
    return (React.createElement("div", { className: "danho-plugin-settings" },
        React.createElement(FormSection, { title: "Danho Library Features" },
            React.createElement(Setting, { setting: "prettyRoles", ...settingProps }),
            React.createElement(Setting, { setting: "badges", ...settingProps }),
            React.createElement(Setting, { setting: "pronounsPageLinks", ...settingProps }),
            React.createElement(Setting, { setting: "allowForumSortByAuthor", ...settingProps }),
            React.createElement(Setting, { setting: "expandBioAgain", ...settingProps }),
            React.createElement(Setting, { setting: "wakeUp", ...settingProps }),
            React.createElement(Setting, { setting: "autoCancelFriendRequests", ...settingProps }),
            React.createElement(Setting, { setting: "showGuildMembersInHeader", ...settingProps }),
            React.createElement(Setting, { setting: "addToDungeon", ...settingProps }),
            React.createElement(Setting, { setting: "lockChannels", ...settingProps }),
            React.createElement(Setting, { setting: "nonObnoxiousProfileEffects", ...settingProps })),
        tabs.some(([_, value]) => value) && (React.createElement(TabBar, { tabs: tabs, prettyRoles: React.createElement(PrettyRolesSettings, { ...settingProps }), badges: React.createElement(BadgesSettings, { ...settingProps }), autoCancelFriendRequests: React.createElement(AutoCancelFriendRequestSettings, { ...settingProps }), lockChannels: React.createElement(LockSettings, { ...settingProps }) }))));
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
    contextMenu('dev-context', result => {
        return modifyRoleContextMenu(result);
    });
}

const RolesListModule = demangle({
    RolesList: bySource$1('onAddRole')
}, null, true);

const createPatcherCallback = (callback) => callback;
const createPatcherAfterCallback = (callback) => callback;
const createPatcherCallback$1 = createPatcherCallback;

const setManagerContext = createPatcherCallback$1(({ args, original }) => {
    const result = original(...args);
    PrettyRolesManager.context = result.props;
    return result;
});

function insteadRolesList() {
    instead(RolesListModule, 'RolesList', (data) => {
        return setManagerContext(data);
    });
}

function prettyRoles$1() {
    $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
        const roleId = el.attr('data-list-item-id')?.split('_').pop();
        if (!roleId)
            return;
        const role = PrettyRolesManager.getRole(roleId);
        if (!role)
            return;
        el.setStyleProperty('--role-color', hexToRgb(role.colorString
            ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number))).join(','));
        if (Settings.current.groupRoles) {
            const isGroupRole = role.name.toLowerCase().includes('roles');
            if (isGroupRole)
                el.addClass('danho-library__pretty-roles__group-role');
        }
    });
}

function afterRolesList() {
    after(RolesListModule, 'RolesList', () => {
        prettyRoles$1();
    });
}

function afterUserProfileModalAboutMe() {
    const UserProfileModalAboutMe = Finder.findBySourceStrings('look:"profile_modal"', { defaultExport: false });
    if (!UserProfileModalAboutMe)
        return console.error('UserProfileModalAboutMe not found');
    after(UserProfileModalAboutMe, 'Z', () => {
        prettyRoles$1();
    }, { name: 'UserProfileModalAboutMe' });
}

const prettyRoles = "*[role=list][data-list-id*=roles] > div div:has([class*=roleRemoveButton][role=button]),\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveButton][role=button],\n*[role=list][data-list-id*=roles] > div [class*=roleFlowerStar],\n*[role=list][data-list-id*=roles] > div [class*=roleCircle] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n}\n\n*[role=list][data-list-id*=roles] {\n  padding: 1rem;\n}\n*[role=list][data-list-id*=roles]:has(.danho-library__pretty-roles__group-role) div:has([class*=expandButton]) {\n  flex: 1 1 50%;\n}\n\n*[role=list][data-list-id*=roles] > div {\n  --role-color--default: rgb(86, 105, 118);\n  --role-color: var(--role-color--default);\n  --role-color-alpha: .125;\n  position: relative;\n  border: 1px solid rgb(var(--role-color, --role-color--default));\n  background-color: rgba(var(--role-color, --role-color--default), var(--role-color-alpha));\n  border-radius: 0.25rem;\n  height: 25px;\n  box-sizing: border-box;\n  justify-content: center;\n}\n*[role=list][data-list-id*=roles] > div [class*=roleCircle],\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveIcon] {\n  height: 100%;\n  width: 100%;\n}\n*[role=list][data-list-id*=roles] > div span[class*=roleCircle] {\n  background-color: unset !important;\n}\n*[role=list][data-list-id*=roles] > div svg[class*=roleRemoveIcon] {\n  display: none;\n}\n*[role=list][data-list-id*=roles] > div div:has(svg[class*=linkIcon]) {\n  position: absolute;\n  top: -0.5rem;\n  left: -0.75rem;\n}\n*[role=list][data-list-id*=roles] > div:hover svg[class*=linkIcon] {\n  display: inline-block !important;\n}\n\n.danho-library__pretty-roles__group-role {\n  flex: 1 1 100% !important;\n  margin-inline: -1rem;\n}";

const isPrettyRolesEnabled = () => Settings.current.prettyRoles;
function Feature$b() {
    if (!isPrettyRolesEnabled())
        return;
    insteadRolesList();
    afterRolesList();
    afterUserProfileModalAboutMe();
    afterRoleContextMenu();
}

const PrettyRoles = {
    __proto__: null,
    default: Feature$b,
    isPrettyRolesEnabled,
    styles: prettyRoles
};

let CustomBadge = null;
function patchBadgeComponent(result) {
    if (!result.props.children[0])
        return;
    const TooltipWrapper = result.props.children[0].type;
    const TooltipContent = result.props.children[0].props.children.type;
    CustomBadge = ({ name, iconUrl, style, href }) => {
        if (!name || !iconUrl)
            return null;
        const InnerBadge = ({ href }) => href ? (React.createElement("a", { href: href, target: "_blank", rel: "noreferrer noopener" },
            React.createElement(InnerBadge, null))) : (React.createElement("img", { src: iconUrl, alt: name, className: result.props.children[0].props.children.props.children[0].props.className, style: style }));
        return (React.createElement(TooltipWrapper, { text: name },
            React.createElement(TooltipContent, null,
                React.createElement(InnerBadge, { href: href }))));
    };
}
function insertBadges(result, badgeData) {
    if (!result)
        return;
    if (result.props.children.some(badge => badge.type === CustomBadge))
        return;
    const badges = result.props.children;
    const newBadges = badgeData
        .filter(({ userTags }) => userTags ? checkUserId(userTags) : true)
        .sort((a, b) => getPosition(a.position) - getPosition(b.position))
        .map(({ size, position, ...props }) => [position, React.createElement(CustomBadge, { key: props.name, ...props, style: { width: size, height: size } })]);
    for (const [position, badge] of newBadges) {
        badges.splice(getPosition(position), 0, badge);
    }
    function checkUserId(userTags) {
        const userTag = $(s => s.role('dialog').className('userTag'))?.value.toString()
            ?? $(s => s.className('userProfileOuter').className('userTag'))?.value.toString()
            ?? $(s => s.className('accountProfileCard').className('usernameInnerRow'), false)
                .map(dq => dq.children(undefined, true).value.toString())[1];
        return userTags.includes(userTag);
    }
    function getPosition(position) {
        if (position === undefined || position === 'end')
            return badges.length;
        if (position === 'start')
            return 0;
        if (typeof position === 'number')
            return position;
        const [startIndex, endIndex] = [position.before, position.after].map((badgeType, i) => badgeType
            ? badges.findIndex(badge => badge.key.includes(badgeType.toLowerCase())) + i
            : -1);
        return startIndex === -1 && endIndex === -1 ? badges.length
            : startIndex === -1 ? endIndex
                : endIndex === -1 ? startIndex
                    : position.default === undefined ? Math.max(startIndex, endIndex) - Math.min(startIndex, endIndex)
                        : position.default ?? badges.length;
    }
}

function movePremiumBeforeBoost(props) {
    const nitroBadge = props.children.find(badge => badge.props.children.props.href?.includes(BadgeTypes.NITRO_ANY));
    const boosterBadgePos = props.children.findIndex(badge => badge.props.text.toLowerCase().includes('boost'));
    if (!nitroBadge || boosterBadgePos === -1)
        return props;
    props.children.splice(props.children.indexOf(nitroBadge), 1);
    props.children.splice(boosterBadgePos - 1, 0, nitroBadge);
    return props;
}

const modifyBadges = createPatcherAfterCallback(({ result }) => {
    if (!CustomBadge)
        return patchBadgeComponent(result);
    if (Settings.current.movePremiumBadge)
        movePremiumBeforeBoost(result.props);
    insertBadges(result, Object.values(Badges$1.current));
});

function afterBadgeList() {
    after(RenderedUserProfileBadgeList, 'Z', data => {
        modifyBadges(data);
    }, { name: 'BadgeList' });
}

function Feature$a() {
    if (!Settings.current.badges)
        return;
    Badges$1.load();
    afterBadgeList();
}

const Badges = {
    __proto__: null,
    default: Feature$a
};

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
    after(TextModule, 'render', (data) => {
        transformTextIntoLinks(data);
    }, { name: 'TextModule--Pronouns' });
}

function Feature$9() {
    if (!Settings.current.pronounsPageLinks)
        return;
    afterTextModule();
}

const PronounsPageLinks = {
    __proto__: null,
    default: Feature$9
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

async function patchSortAndView() {
    const addSortAndViewButtonClick = () => {
        if (!testForumChannel())
            return;
        const sortAndViewButton = $(s => s.ariaLabel('Sort & view').and.type('button'));
        sortAndViewButton?.on('click', addSortByAuthorOnDOM);
        debugLog(sortAndViewButton ? 'Sort and view button found' : 'Sort and view button not found');
    };
    addSortAndViewButtonClick();
    ActionsEmitter.on('CHANNEL_SELECT', async () => {
        await sleep(1000);
        addSortAndViewButtonClick();
    });
}
function testForumChannel() {
    const [_blank, _channelsString, _guildId, channelId] = window.location.pathname.split('/');
    const channel = ChannelStore.getChannel(channelId);
    if (!channel)
        return false;
    return channel.type === 15 ;
}

function Feature$8() {
    if (!Settings.current.allowForumSortByAuthor)
        return;
    patchSortAndView();
}

const SortForumsByAuthor = {
    __proto__: null,
    default: Feature$8
};

const style$2 = ".danho-expand-bio-again div[class*=descriptionClamp] {\n  display: block !important;\n  max-height: unset !important;\n}\n.danho-expand-bio-again button[class*=viewFullBio] {\n  display: none !important;\n}";

function Feature$7() {
    if (!Settings.current.expandBioAgain)
        return;
    $('#app-mount').addClass('danho-expand-bio-again');
}

const ExpandBioAgain = {
    __proto__: null,
    default: Feature$7,
    styles: style$2
};

function Feature$6() {
    if (!Settings.current.wakeUp)
        return;
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
                        const dispatch = Finder.findBySourceStrings('getStatus()', 'updateAsync("status",');
                        if (!dispatch)
                            return BdApi.UI.showToast('Could not find dispatcher', { type: 'error' });
                        dispatch('online', status, undefined, undefined);
                        close();
                    }
                },
            ]
        });
    }
}

const WakeUp = {
    __proto__: null,
    default: Feature$6
};

const RelationshipActions = Finder.findBySourceStrings("cancelFriendRequest", "addRelationship", "removeRelationship");

function PatchGuildContextMenu(callback) {
    return BdApi.ContextMenu.patch('guild-context', callback);
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

function Feature$5() {
    if (!Settings.current.autoCancelFriendRequests || Settings.current.folderNames.length === 0)
        return;
    ActionsEmitter.on('RELATIONSHIP_ADD', ({ relationship }) => {
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
        if (mutualGuildIds === undefined)
            return cancelFriendRequest();
        else if (mutualGuildIds.length === 0)
            return;
        const mutualGuildIdsInBlockFolders = mutualGuildIds.filter(guildId => blockFolders.some(folder => folder.guildIds.includes(guildId)));
        if (mutualGuildIdsInBlockFolders.length === 0)
            return;
        else if (mutualGuildIdsInBlockFolders.length !== mutualGuildIds.length)
            return;
    });
    PatchGuildContextMenu((menu, props) => {
        if (!props.folderName)
            return;
        const isInBlockedFolder = Settings.current.folderNames.includes(props.folderName);
        menu.props.children.push(buildTextItemElement('danho-block-friend-requests', isInBlockedFolder ? 'Unblock friend requests' : 'Block friend requests', () => {
            Settings.update(cur => ({ ...cur, folderNames: isInBlockedFolder
                    ? cur.folderNames.filter(v => v !== props.folderName)
                    : [...cur.folderNames, props.folderName] }));
        }, { color: 'danger' }));
    });
}

const BlockFriendRequests = {
    __proto__: null,
    default: Feature$5
};

function Feature$4() {
    const headerMemo = Finder.findBySourceStrings("hasCommunityInfoSubheader()", "ANIMATED_BANNER", "header");
    if (!headerMemo)
        return Logger.error("Failed to find header memo");
    const MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false });
    if (!MemberListItem)
        return Logger.error("Failed to find MemberListItem");
    after(MemberListItem, 'Z', ({ args: [props] }) => {
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
    }, { name: 'GuildHeader' });
}

const ShowGuildMembersInHeader = {
    __proto__: null,
    default: Feature$4
};

function PatchUserContextMenu(callback) {
    return BdApi.ContextMenu.patch('user-context', callback);
}

const DEADLY_NINJA_ID = '405763731079823380';
const DUNGEON_ID = '760145289956294716';
function Feature$3() {
    if (!Settings.current.addToDungeon)
        return;
    const permissionActions = Finder.findBySourceStrings("addRecipient", "clearPermissionOverwrite", "updatePermissionOverwrite", "backupId=493683");
    const hasPermission = (channel, userId, accessPermissions) => {
        if (!accessPermissions)
            return false;
        const userPermissions = channel.permissionOverwrites[userId]?.allow ?? 0n;
        return BigInt(userPermissions & accessPermissions) === accessPermissions;
    };
    PatchUserContextMenu((menu, props) => {
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
                permissionActions.clearPermissionOverwrite(DUNGEON_ID, props.user.id);
            else
                permissionActions.updatePermissionOverwrite(DUNGEON_ID, allow(props.user.id));
        }));
    });
}

const QuickAddMemberToDungeon = {
    __proto__: null,
    default: Feature$3
};

class ChannelLock {
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
            React.createElement(FormItem, { title: 'Password' }),
            React.createElement("input", { type: "password", name: "password" })),
        React.createElement(Button, { type: "submit" }, "Login")));
}

const style$1 = ".bdd-wrapper:has(#secret-channel-login) {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: absolute;\n  inset: 0;\n  background-color: var(--background-primary);\n  height: 100%;\n  width: 100%;\n  z-index: 9999;\n}\n\n#secret-channel-login {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1rem;\n}\n\ndiv:has(> #secret-channel-login) {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}";

const DUNGEON_GUILD_ID = '460926327269359626';
const HELLO_CHANNEL_ID = '1303419756572835930';
let debouncedLoginRemover;
function Feature$2() {
    const Lock = new ChannelLock(Settings.current.lockUnlockForMinutes, Settings.current.initialLockState);
    ActionsEmitter.on('CHANNEL_SELECT', async ({ channelId, guildId }) => {
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
            return Logger.log(`Could not find content container`, {
                get contentContainer() {
                    return $(`[class*='content']:has(> main[class*='chatContent'])`);
                }
            });
        if (Lock.isLocked)
            contentContainer.insertComponent('afterbegin', React.createElement(Login, { onSubmit: password => {
                    const correct = password === Settings.current.lockPassword;
                    if (!correct)
                        return BdApi.UI.showToast('Incorrect password', { type: 'error' });
                    $(`#${LOGIN_ID}`).parent.unmount();
                    Lock.unlock();
                } }));
    });
}

const LockHello = {
    __proto__: null,
    default: Feature$2,
    style: style$1
};

function PatchChannelContextMenu(callback) {
    return BdApi.ContextMenu.patch('channel-context', callback);
}

const handleVoiceConnect = Finder.findBySourceStrings("handleVoiceConnect");
const VoiceActions = Finder.findBySourceStrings("setVideoEnabled", "setVideoDevice");
function joinWithCamera(channelId) {
    const preferredWebcamId = MediaEngineStore.getVideoDeviceId();
    handleVoiceConnect({ channelId });
    if (!preferredWebcamId) {
        BdApi.UI.showToast("No preferred webcam set", { type: "error" });
        $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
        return;
    }
    VoiceActions.setVideoDevice(preferredWebcamId);
    VoiceActions.setVideoEnabled(true);
}

function Feature$1() {
    PatchChannelContextMenu((menu, props) => {
        const options = menu.props.children;
        const voiceOptions = options[3].props.children;
        voiceOptions.unshift(buildTextItemElement("join-with-camera", "Join with Camera", () => joinWithCamera(props.channel.id)));
    });
    PatchHomeVoiceChannel();
}
function PatchHomeVoiceChannel() {
    const ChannelItem = Finder.findBySourceStrings("tutorialId", "visible", "shouldShow", { defaultExport: false });
    const HOME_CHANNEL_ID = '1266581800428245094';
    after(ChannelItem, "Z", ({ args: [props] }) => {
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
}

const JoinVoiceWithCamera = {
    __proto__: null,
    default: Feature$1
};

const style = ".danho-non-obnoxious-profile-effects [class*=profileEffects]:hover {\n  opacity: 0.2;\n}";

function Feature() {
    if (!Settings.current.nonObnoxiousProfileEffects)
        return;
    $('#app-mount').addClass('danho-non-obnoxious-profile-effects');
}

const NonObnoxiousProfileEffects = {
    __proto__: null,
    default: Feature,
    styles: style
};

const features = [
    PrettyRoles,
    Badges,
    PronounsPageLinks,
    SortForumsByAuthor,
    ExpandBioAgain,
    WakeUp,
    BlockFriendRequests,
    ShowGuildMembersInHeader,
    QuickAddMemberToDungeon,
    LockHello,
    JoinVoiceWithCamera,
    NonObnoxiousProfileEffects
];
const Features = () => features.forEach(feature => feature.default());
const styles = features.map(feature => 'styles' in feature ? feature.styles
    : 'style' in feature ? feature.style
        : '').join("\n\n");

const index = buildPlugin({
    start() {
        Features();
    },
    stop() {
        ActionsEmitter.removeAllListeners();
    },
    styles,
    Settings,
    SettingsPanel
});

module.exports = index;

/*@end @*/
