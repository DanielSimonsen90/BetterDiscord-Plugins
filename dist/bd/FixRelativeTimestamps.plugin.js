/**
 * @name FixRelativeTimestamps
 * @version 1.0.0
 * @author danhosaur
 * @authorLink https://github.com/danhosaur
 * @description This plugin fixes wrongly rounded timestamps when using the RELATIVE format.
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/FixRelativeTimestamps
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
  "name": "fix-relative-timestamps",
  "version": "1.0.0",
  "author": "danhosaur",
  "description": "This plugin fixes wrongly rounded timestamps when using the RELATIVE format."
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

const { React } = BdApi;
const { ReactDOM } = BdApi;
const classNames = /* @__PURE__ */ find$1((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);

const Button = /* @__PURE__ */ byKeys(["Colors", "Link"], { entries: true });

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
        React.createElement(FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
        React.createElement(Flex, { justify: Flex.Justify.END },
            React.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                }) }, "Reset")))) : null));

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

function bySourceStrings(...keywords) {
    const searchOptions = keywords.find(k => typeof k === 'object');
    if (searchOptions)
        keywords.splice(keywords.indexOf(searchOptions), 1);
    const backupIdKeyword = keywords.find(k => k.toString().startsWith('backupId='));
    const backupId = backupIdKeyword ? backupIdKeyword.toString().split('=')[1] : null;
    const backupIdKeywordIndex = keywords.indexOf(backupIdKeyword);
    if (backupIdKeywordIndex > -1)
        keywords.splice(backupIdKeywordIndex, 1);
    if (backupId)
        debugLog(`[bySourceStrings] Using backupId: ${backupId} - [${keywords.join(',')}]`, keywords);
    const showMultiple = keywords.find(k => k === 'showMultiple=true');
    const showMultipleIndex = keywords.indexOf(showMultiple);
    if (showMultipleIndex > -1)
        keywords.splice(showMultipleIndex, 1);
    if (showMultiple)
        debugLog(`[bySourceStrings] Showing multiple results - [${keywords.join(',')}]`, keywords);
    const lazy = keywords.find(k => k === 'lazy=true');
    const lazyIndex = keywords.indexOf(lazy);
    if (lazyIndex > -1)
        keywords.splice(lazyIndex, 1);
    if (lazy)
        debugLog(`[bySourceStrings] Using lazy search - [${keywords.join(',')}]`, keywords);
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
            debugWarn(`[bySourceStrings] Filter failed for keywords: [${keywords.join(',')}]`, {
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
            error(`[bySourceStrings] Error in moduleCallback`, err);
        }
    };
    if (lazy)
        return BdApi.Webpack.waitForModule(moduleCallbackBoundary, {
            signal: controller.signal,
            ...searchOptions
        }).then(module => {
            debugLog(`[bySourceStrings] Found lazy module for [${keywords.join(',')}]`, module);
            return module;
        }).catch(err => {
            error(`[bySourceStrings] Error in lazy search`, err);
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
    const module = bySourceStrings(...keywords);
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
    bySourceStrings,
    findComponentBySourceStrings,
    findModuleById,
    findUnpatchedModuleBySourceStrings,
};

const RelativeTimeModule = Finder.bySourceStrings('"R"!==e.format', { defaultExport: false });

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
    SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR,
    timeSpan,
    throttle,
};

function afterRelativeTimeModule() {
    after(RelativeTimeModule, 'Z', ({ result, args: [args] }) => {
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
            || getTime(TimeUtils.YEAR, 'year')
            || getTime(TimeUtils.MONTH, 'month')
            || getTime(TimeUtils.WEEK, 'week')
            || getTime(TimeUtils.DAY, 'day')
            || getTime(TimeUtils.HOUR, 'hour')
            || getTime(TimeUtils.MINUTE, 'minute')
            || getTime(TimeUtils.SECOND, 'second')
            || `A long time ago, in a galaxy far, far away... (parsing failed)`);
    }, { name: 'RelativeTimeModule' });
}

function patch() {
    afterRelativeTimeModule();
}

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

const updateNodes = () => $(s => s.className('text-sm/normal')
    .and
    .has(s => s.className("timestamp", "span").and.ariaLabel()), false).forEach(node => node.forceUpdate());
const index = createPlugin({
    start() {
        patch();
        updateNodes();
    },
    stop() {
        updateNodes();
    }
});

module.exports = index;

/*@end @*/
