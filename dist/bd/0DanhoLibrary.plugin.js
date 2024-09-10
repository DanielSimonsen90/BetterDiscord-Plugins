/**
 * @name 0Danholibrary
 * @version 1.0.0
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
  "version": "1.0.0",
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
const query = (query, options) => find(query$1(query), options);
const byEntries = (...filters) => find(join(...filters.map((filter) => byEntry(filter))));
const byName = (name, options) => find(byName$1(name), options);
const byKeys = (keys, options) => find(byKeys$1(...keys), options);
const byProtos = (protos, options) => find(byProtos$1(...protos), options);
const bySource = (contents, options) => find(bySource$1(...contents), options);
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

const Finder = {
    __proto__: null,
    abort,
    all,
    byEntries,
    byKeys,
    byName,
    byProtos,
    bySource,
    demangle,
    find,
    query,
    resolveKey,
    waitFor
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
        log(`Patched ${options.name ?? String(method)}`);
    }
    return cancel;
};
const instead = (object, method, callback, options = {}) => patch("instead", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
const before = (object, method, callback, options = {}) => patch("before", object, method, (cancel, original, context, args) => callback({ cancel, original, context, args }), options);
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

const Patcher = {
    __proto__: null,
    after,
    before,
    contextMenu,
    instead,
    unpatchAll
};

const inject = (styles) => {
    if (typeof styles === "string") {
        BdApi.DOM.addStyle(getMeta().name, styles);
    }
};
const clear = () => BdApi.DOM.removeStyle(getMeta().name);

const ChannelStore = /* @__PURE__ */ byName("ChannelStore");
const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const i18n = /* @__PURE__ */ byKeys(["languages", "getLocale"]);

const GuildStore$1 = /* @__PURE__ */ byName("GuildStore");
const GuildMemberStore = /* @__PURE__ */ byName("GuildMemberStore");

const MediaEngineStore = /* @__PURE__ */ byName("MediaEngineStore");

const { React: React$1 } = BdApi;
const { ReactDOM } = BdApi;
const classNames = /* @__PURE__ */ find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);
const lodash = /* @__PURE__ */ byKeys(["cloneDeep", "flattenDeep"]);
const semver = /* @__PURE__ */ byKeys(["SemVer"]);
const moment = /* @__PURE__ */ byKeys(["utc", "months"]);
const hljs = /* @__PURE__ */ byKeys(["highlight", "highlightBlock"]);

const UserStore = /* @__PURE__ */ byName("UserStore");
const PresenceStore = /* @__PURE__ */ byName("PresenceStore");
const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const { useState: useState$4 } = React$1;
function Collapsible({ children, ...props }) {
    const [isOpen, setIsOpen] = useState$4(props.defaultOpen ?? false);
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
    const Title = typeof props.title === 'string' ? React$1.createElement("h3", null, props.title) : props.title;
    const TitleOpen = typeof props.titleOpen === 'string' ? React$1.createElement("h3", null, props.titleOpen) : props.titleOpen;
    return (React$1.createElement("div", { className: `collapsible ${props.className ?? ''}`, "data-open": isOpen, "data-disabled": disabled },
        React$1.createElement("div", { className: "collapsible__header", onClick: toggle },
            isOpen ? TitleOpen ?? Title : Title,
            React$1.createElement("span", { style: { display: 'flex' } })),
        React$1.createElement("div", { className: classNames('collapsible__content', isOpen ? 'visible' : 'hidden') }, children)));
}

const getEmojiUrl = (emoji, size = 128) => (`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}` +
    `?size=${size}&qualiy=lossless`);
const EmojiStore = byName("EmojiStore");

const GuildChannelStore = byKeys(["getTextChannelNameDisambiguations"]);

const GuildEmojiStore = byKeys(["getEmojis"]);

const GuildIdentyStore = byKeys(["saveGuildIdentityChanges"]);

const GuildStore = byName("GuildStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const ThemeStore = byKeys(["theme"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

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

const UserTypingStore = byKeys(["getTypingUsers", "isTyping"]);

const Stores = {
    __proto__: null,
    BetterProfileSettings,
    ChannelStore,
    EmojiStore,
    GuildChannelStore,
    GuildEmojiStore,
    GuildIdentyStore,
    GuildMemberStore,
    GuildStore,
    MediaEngineStore,
    PresenceStore,
    SelectedChannelStore,
    SelectedGuildStore,
    ThemeStore,
    UserActivityStore,
    UserMentionStore,
    UserNoteStore,
    UserProfileSettingsStore,
    UserSettingsAccountStore,
    UserStore,
    UserTypingStore,
    getEmojiUrl
};

function GuildListItem(props) {
    const guildId = React$1.useMemo(() => 'guildId' in props ? props.guildId : props.guild.id, [props]);
    const guild = React$1.useMemo(() => 'guild' in props ? props.guild : GuildStore.getGuild(guildId), [guildId]);
    const { children } = props;
    return (React$1.createElement("div", { className: "guild-list-item" },
        React$1.createElement("img", { className: "guild-list-item__icon", src: window.DL.Guilds.getIconUrl(guild), alt: guild.name }),
        React$1.createElement("div", { className: "guild-list-item__content-container" },
            React$1.createElement("span", { className: "guild-list-item__name" }, guild.name),
            React$1.createElement("span", { className: "guild-list-item__content" }, children))));
}

function Checkmark({ tooltip }) {
    return (
    React$1.createElement("svg", { "aria-label": tooltip, className: 'botTagVerified', "aria-hidden": false, width: "16", height: "16", viewBox: "0 0 16 15.2" },
        React$1.createElement("path", { d: "M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z", fill: "currentColor" })));
}

function CloseButton() {
    return (React$1.createElement("svg", { "aria-hidden": false, width: "16", height: "16", viewBox: "0 0 24 24" },
        React$1.createElement("path", { fill: "currentColor", d: "M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z" })));
}

function EditPencil() {
    return (React$1.createElement("svg", { className: "icon-E4cW1l", "aria-hidden": "true", role: "img", width: "16", height: "16", viewBox: "0 0 24 24" },
        React$1.createElement("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z", fill: "currentColor" })));
}

function EphemeralEye() {
    return (
    React$1.createElement("svg", { className: 'MessageLocalBot.icon', "aria-hidden": false, width: "16", height: "16", viewBox: "0 0 24 24" },
        React$1.createElement("path", { fill: "currentColor", d: "M12 5C5.648 5 1 12 1 12C1 12 5.648 19 12 19C18.352 19 23 12 23 12C23 12 18.352 5 12 5ZM12 16C9.791 16 8 14.21 8 12C8 9.79 9.791 8 12 8C14.209 8 16 9.79 16 12C16 14.21 14.209 16 12 16Z" }),
        React$1.createElement("path", { fill: "currentColor", d: "M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" })));
}

const Common = /* @__PURE__ */ byKeys(["Button", "Switch", "Select"]);

const Button = Common.Button;

const Flex = /* @__PURE__ */ byKeys(["Child", "Justify"], { entries: true });

const { FormSection, FormItem, FormTitle, FormText, FormLabel, FormDivider, FormSwitch, FormNotice } = Common;

const margins = /* @__PURE__ */ byKeys(["marginBottom40", "marginTop4"]);

const TextInput = byName("TextInput");

const { useState: useState$3 } = React$1;
function Setting({ setting, settings, set, onChange, titles }) {
    const [v, setV] = useState$3(settings[setting]);
    switch (typeof v) {
        case 'boolean': return React$1.createElement(FormSwitch, { className: 'danho-form-switch', key: setting.toString(), note: titles[setting.toString()], value: v, hideBorder: true, onChange: checked => {
                set({ [setting]: checked });
                onChange?.(checked);
                setV(checked);
            } });
        case 'number':
        case 'string': return React$1.createElement(TextInput, { key: setting.toString(), title: titles[setting], value: v, onChange: value => {
                set({ [setting]: value });
                onChange?.(value);
                setV(value);
            } });
        default: return (React$1.createElement("div", { className: 'settings-error' },
            React$1.createElement("h1", null, "Unknown value type"),
            React$1.createElement("h3", null,
                "Recieved ",
                typeof v),
            React$1.createElement("h5", null, JSON.stringify(v))));
    }
}

const Components = {
    __proto__: null,
    Checkmark,
    CloseButton,
    Collapsible,
    EditPencil,
    EphemeralEye,
    GuildListItem,
    Setting
};

const { useEffect: useEffect$2 } = React$1;
function useCtrlZY({ onCtrlY, onCtrlZ }) {
    useEffect$2(() => {
        const onKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'z') {
                onCtrlZ();
            }
            else if (e.ctrlKey && e.key === 'y') {
                onCtrlY();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onCtrlZ, onCtrlY]);
}

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
    return queryFiber(fiber, (node) => node?.stateNode instanceof React$1.Component, "up" , depth);
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

const SettingsContainer = ({ name, children, onReset }) => (React$1.createElement(FormSection, null,
    children,
    onReset ? (React$1.createElement(React$1.Fragment, null,
        React$1.createElement(FormDivider, { className: classNames(margins.marginTop20, margins.marginBottom20) }),
        React$1.createElement(Flex, { justify: Flex.Justify.END },
            React$1.createElement(Button, { size: Button.Sizes.SMALL, onClick: () => confirm(name, "Reset all settings?", {
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
        getSettingsPanel: SettingsPanel ? () => (React$1.createElement(SettingsContainer, { name: meta.name, onReset: Settings ? () => Settings.reset() : null },
            React$1.createElement(SettingsPanel, null))) : null
    };
};

const { useState: useState$2, useEffect: useEffect$1 } = React$1;
function usePatcher(module, type, patch, callback, config) {
    const { once } = config;
    const repatchDeps = config.repatchDeps ?? [];
    const [patched, setPatched] = useState$2(false);
    const [cancel, setCancel] = useState$2(() => () => { });
    useEffect$1(() => {
        setCancel(Patcher[type](module, patch, callback, { once }));
        setPatched(true);
        return cancel;
    }, repatchDeps);
    return [patched, cancel];
}

const { useState: useState$1, useMemo } = React$1;
function useMemoedState(initialState, factory, dependencies = []) {
    const [state, setState] = useState$1(initialState);
    const memo = useMemo(() => factory(state), [state, ...dependencies]);
    return [memo, setState, state];
}

const { useEffect, useRef } = React$1;
function useDebounce(callback, delay, dependencies) {
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    useEffect(() => {
        const handler = setTimeout(() => callbackRef.current(), delay);
        return () => clearTimeout(handler);
    }, dependencies);
}

const { useState, useCallback } = React$1;
function useStateStack(initialState) {
    const [lastState, setLastState] = useState(initialState);
    const [stack, setStack] = useState([initialState]);
    useDebounce(() => setStack((prev) => {
        if (prev[prev.length - 1] === lastState)
            return prev;
        return [...prev, lastState];
    }), 1000, [lastState]);
    const pop = useCallback((amount = 0) => setStack((prev) => {
        if (prev.length === 1)
            return prev;
        return prev.slice(0, prev.length - 1 - amount);
    }), []);
    const undo = useCallback(() => setStack((prev) => {
        if (prev.length === 1)
            return prev;
        setLastState(prev[prev.length - 2]);
        return prev.slice(0, prev.length - 1);
    }), []);
    const redo = useCallback(() => setStack((prev) => {
        if (prev.length === 1)
            return prev;
        setLastState(prev[prev.length - 1]);
        return prev.slice(0, prev.length - 1);
    }), []);
    const clear = useCallback((state) => {
        setLastState(state ?? initialState);
        setStack([state ?? initialState]);
    }, [initialState]);
    return [lastState, { push: setLastState, pop, undo, redo, clear }];
}

const Hooks = {
    __proto__: null,
    useCtrlZY,
    useDebounce,
    useMemoedState,
    usePatcher,
    useStateStack
};

const { React } = BdApi;
const CompiledReact = {
    ...React,
    Components,
    Hooks,
};

class ElementSelector {
    constructor() {
        this.result = "";
    }
    getElementFromReactInstance(instance, allowMultiple = false) {
        return getElementFromReactInstance(instance, allowMultiple);
    }
    getSelectorFromElement(element) {
        const selector = new ElementSelector();
        if (element.id)
            selector.id(element.id).and;
        if (element.className)
            selector.className(element.className).and;
        if (element.getAttribute("aria-label"))
            selector.ariaLabel(element.getAttribute("aria-label")).and;
        if (element.getAttribute("role"))
            selector.role(element.getAttribute("role")).and;
        if (element.dataset) {
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
    mutationManagerId(id, tagName) {
        this.result += `${tagName ?? ''}[data-mutation-manager-id="${id}"] `;
        return this;
    }
    data(prop, value) {
        this.result += `[data-${prop}${value ? `="${value}"` : ''}] `;
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
    if (single)
        return new DQuery(selector);
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
    addClass(className) {
        this.element.classList.add(className);
        return this;
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
        return getElement(this.element) ? new DQuery(getElement(this.element)) : undefined;
    }
    get firstChild() {
        return this.children()[0];
    }
    get lastChild() {
        const children = this.children();
        return children[children.length - 1];
    }
    ancestor(selector) {
        const getAnscestorSelector = () => {
            const _selector = typeof selector === 'function' ? selector(new ElementSelector(), $) : selector;
            if (typeof _selector === 'string')
                return _selector;
            if (_selector instanceof ElementSelector)
                return _selector.toString();
            if (_selector instanceof DQuery)
                return new ElementSelector().getSelectorFromElement(_selector.element);
            if (_selector instanceof HTMLElement)
                return new ElementSelector().getSelectorFromElement(_selector);
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
            return this.fiber.memoizedProps;
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
        try {
            return getProp(this.fiber.memoizedProps, []) ?? [undefined, undefined];
        }
        catch (err) {
            console.error(err, this);
            return [undefined, undefined];
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
    replaceComponent(component) {
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
function createElement(html, props = {}, target) {
    if (html === "<></>" || html.toLowerCase() === "fragment") {
        html = `<div ${Object.entries(props).reduce((result, [key, value]) => {
            return result + `${key}="${value}" `;
        }, "")}></div>`;
    }
    const element = (() => {
        if (html.startsWith('<')) {
            const element = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
            element.classList.add("bdd-wrapper");
            return element;
        }
        return Object.assign(document.createElement(html), props);
    })();
    return element;
}

const DanhoModules = {
    CompiledReact,
    $,
    DQuery,
    ElementSelector,
};

const DiscordModules = {
    hljs,
    i18n,
    lodash,
    moment,
    semver,
    React: React$1, ReactDOM,
    ...DanhoModules
};

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
    getPresenceState: () => PresenceStore.getState()
};

const VoiceInfo = byKeys(["isSelfMute", "isNoiseCancellationSupported"]);
VoiceInfo.getMediaEngine();
VoiceInfo.getVideoComponent();
VoiceInfo.getCameraComponent();
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

const GuildActions = byKeys(["requestMembers"]);

const GuildUtils = {
    ...GuildStore$1,
    ...GuildMemberStore,
    ...GuildChannelStore,
    ...GuildEmojiStore,
    ...SelectedGuildStore,
    ...VoiceInfo,
    ...VoiceStore,
    ...GuildActions,
    get current() {
        return GuildStore$1.getGuild(SelectedGuildStore.getGuildId());
    },
    getSelectedGuildTimestamps() {
        return SelectedGuildStore.getState().selectedGuildTimestampMillis;
    },
    getIconUrl(guild) {
        return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png';
    }
};

function findNodeByIncludingClassName(className, node = document.body) {
    return node.querySelector(`[class*="${className}"]`);
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
    const module = typeof args === 'string' ? query({ name: args }) : query({ keys: args });
    if (!module)
        return module;
    return returnDisplayNamesOnly ?
        Array.isArray(module) ?
            module.map(m => m.default?.displayName || m.displayName) :
            module.default?.displayName || module.displayName
        : module;
}
function findStore(storeName, allowMultiple = false) {
    const result = Object.values(byName("UserSettingsAccountStore")
        ._dispatcher._actionHandlers._dependencyGraph.nodes).sort((a, b) => a.name.localeCompare(b.name))
        .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));
    return allowMultiple ? result : result[0];
}
function currentGuild() {
    const guildId = SelectedGuildStore.getGuildId();
    return guildId ? GuildStore$1.getGuild(guildId) : null;
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
    findClassModuleContainingClass,
    findModule,
    findStore,
    get currentGuild() { return currentGuild(); },
    get currentChannel() { return currentChannel(); },
    get currentGuildMembers() { return currentGuildMembers(); },
};

const Actions = {
    __proto__: null,
    GuildActions,
    UserNoteActions
};

const styles = ".collapsible {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 1px solid var(--primary-500);\n  border-radius: 4px;\n  overflow: hidden;\n  margin: 1rem 0;\n}\n.collapsible__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 1rem;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.collapsible__header > span::after {\n  content: \"\";\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid var(--interactive-muted);\n  margin-left: 0.5rem;\n}\n.collapsible__header > span::after:hover {\n  border-top-color: var(--interactive-hover);\n}\n.collapsible__content {\n  padding: 0.5rem 1rem;\n  background-color: var(--background-secondary);\n  border-top: 1px solid var(--primary-500);\n}\n.collapsible[data-open=true] > .collapsible__header > span::after {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid var(--interactive-normal);\n}\n.collapsible[data-disabled=true] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.guild-list-item {\n  display: flex;\n  flex-direction: row;\n  font-size: 24px;\n  align-items: center;\n}\n.guild-list-item__icon {\n  --size: 2rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  margin-right: 1ch;\n}\n.guild-list-item__content-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 1rem;\n}\n.guild-list-item__name {\n  font-weight: bold;\n  color: var(--text-primary);\n}\n.guild-list-item__content {\n  color: var(--text-tertiary);\n}\n\n.danho-form-switch {\n  flex-direction: row-reverse;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.hidden {\n  display: none;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}";

const LibraryPlugin = new class DanhoLibrary {
    constructor() {
        this.Modules = DiscordModules;
        this.Utils = Utils;
        this.Users = UserUtils;
        this.Guilds = GuildUtils;
        this.Stores = Stores;
        this.Actions = Actions;
        this.Components = Components;
        this.Finder = Finder;
        this.Filters = Filters;
        this.styles = styles;
    }
    start() { }
};
window.DL = LibraryPlugin;
const index = createPlugin(LibraryPlugin);

module.exports = index;

/*@end @*/
