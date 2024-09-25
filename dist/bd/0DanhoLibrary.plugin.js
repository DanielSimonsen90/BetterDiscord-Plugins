/**
 * @name 0Danholibrary
 * @version 1.3.0
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
  "version": "1.3.0",
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
const byEntries = (...filters) => find$1(join(...filters.map((filter) => byEntry(filter))));
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
    demangle,
    find: find$1,
    query,
    resolveKey,
    waitFor
};

const COLOR = "#3a71c1";
const print = (output, ...data) => output(`%c[${getMeta().name}] %c${getMeta().version ? `(v${getMeta().version})` : ""}`, `color: ${COLOR}; font-weight: 700;`, "color: #666; font-size: .8em;", ...data);
const log = (...data) => print(console.log, ...data);
const warn = (...data) => print(console.warn, ...data);

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

const GuildStore$1 = /* @__PURE__ */ byName("GuildStore");
const GuildMemberStore = /* @__PURE__ */ byName("GuildMemberStore");

const ChannelStore = /* @__PURE__ */ byName("ChannelStore");
const SelectedChannelStore = /* @__PURE__ */ byName("SelectedChannelStore");

const SelectedGuildStore = byKeys(["getLastSelectedGuildId"]);

const UserStore = /* @__PURE__ */ byName("UserStore");
const PresenceStore$1 = /* @__PURE__ */ byName("PresenceStore");
const RelationshipStore = /* @__PURE__ */ byName("RelationshipStore");

const UserActivityStore = byKeys(["getUser", "getCurrentUser"]);

const UserNoteStore = byKeys(["getNote", "_dispatcher"]);

const UserTypingStore = byKeys(["getTypingUsers", "isTyping"]);

const UserMentionStore = byKeys(["getMentions", "everyoneFilter"]);

const UserNoteActions = byKeys(["updateNote"]);

const UserUtils = {
    ...UserStore,
    ...PresenceStore$1,
    ...RelationshipStore,
    ...UserActivityStore,
    ...UserNoteStore,
    ...UserTypingStore,
    ...UserMentionStore,
    ...UserNoteActions,
    getPresenceState: () => PresenceStore$1.getState()
};

const { default: Legacy, Dispatcher, Store, BatchedStoreListener, useStateFromStores } = /* @__PURE__ */ demangle({
    default: byKeys$1("Store", "connectStores"),
    Dispatcher: byProtos$1("dispatch"),
    Store: byProtos$1("emitChange"),
    BatchedStoreListener: byProtos$1("attach", "detach"),
    useStateFromStores: bySource$1("useStateFromStores")
}, ["Store", "Dispatcher", "useStateFromStores"]);

const MediaEngineStore = /* @__PURE__ */ byName("MediaEngineStore");

const { React } = BdApi;
const classNames = /* @__PURE__ */ find$1((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);

const ChannelMemberStore = byName('ChannelMemberStore');

const getEmojiUrl = (emoji, size = 128) => (`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}` +
    `?size=${size}&qualiy=lossless`);
const EmojiStore = byName("EmojiStore");

const GuildChannelStore = byKeys(["getTextChannelNameDisambiguations"]);

const GuildEmojiStore = byKeys(["getEmojis"]);

const GuildIdentyStore = byKeys(["saveGuildIdentityChanges"]);

const GuildStore = byName("GuildStore");

const ContentInventoryStore = byName("ContentInventoryStore");

const PresenceStore = /* @__PURE__ */ byName("PresenceStore");

const ThemeStore = byKeys(["theme"]);

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

const VoiceInfo = byKeys(["isSelfMute", "isNoiseCancellationSupported"]);
const MediaEngine = VoiceInfo.getMediaEngine();
const VideoComponent = VoiceInfo.getVideoComponent();
const CameraComponent = VoiceInfo.getCameraComponent();
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

const Stores = {
    __proto__: null,
    get AudioSubSystems () { return AudioSubSystems; },
    BetterProfileSettings,
    CameraComponent,
    ChannelMemberStore,
    ChannelStore,
    ContentInventoryStore,
    EmojiStore,
    GuildChannelStore,
    GuildEmojiStore,
    GuildIdentyStore,
    GuildMemberStore,
    GuildStore,
    MediaEngine,
    get MediaEngineContextTypes () { return MediaEngineContextTypes; },
    get MediaEngineEvent () { return MediaEngineEvent; },
    MediaEngineStore,
    PresenceStore,
    SelectedChannelStore,
    SelectedGuildStore,
    get SupportedFeatures () { return SupportedFeatures; },
    ThemeStore,
    UserActivityStore,
    UserMentionStore,
    UserNoteStore,
    UserProfileSettingsStore,
    UserSettingsAccountStore,
    UserStore,
    UserTypingStore,
    VideoComponent,
    VoiceInfo,
    VoiceStore,
    getEmojiUrl
};

const GuildActions = byKeys(["requestMembers"]);

const GuildUtils = {
    ...GuildStore,
    ...GuildMemberStore,
    ...GuildChannelStore,
    ...GuildEmojiStore,
    ...SelectedGuildStore,
    ...VoiceInfo,
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
    getMembers(guild) {
        return GuildMemberStore.getMembers(guild);
    },
};

function findNodeByIncludingClassName(className, node = document.body) {
    return node.querySelector(`[class*="${className}"]`);
}
function findModule$1(args, returnDisplayNamesOnly = false) {
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
    return allowMultiple
        ? result.map(store => [store.name, byName(store.name) ?? new class InvalidStore {
                constructor() {
                    this.node = store;
                }
            }])
        : result.map(store => byName(store.name) ?? new class InvalidStore {
            constructor() {
                this.node = store;
            }
        })[0];
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
    findModule: findModule$1,
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
        return getElement(this.element) ? new DQuery(getElement(this.element)) : undefined;
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

const DOM = {
    __proto__: null,
    $,
    $p,
    DQuery,
    addEventListener,
    createElement,
    injectElement,
    removeAllEventListeners,
    removeAllInjections
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

const findBySourceStrings = (...keywords) => BdApi.Webpack.getModule(m => m
    && m != window
    && Object.keys(m).length
    && (
    Object.keys(m).some(k => typeof m[k] === 'function' && keywords.every(keyword => m[k].toString().includes(keyword))
        || Object.keys(m).some(k => typeof m[k] === 'object' && m[k] && 'render' in m[k] && keywords.every(keyword => m[k].render.toString().includes(keyword))))), { defaultExport: false, searchExports: true });
const findComponentBySourceStrings = async (...keywords) => {
    const jsxModule = Finder.byKeys(['jsx']);
    const ReactModule = Finder.byKeys(['createElement', 'cloneElement']);
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
    find: find$1,
    findBySourceStrings,
    findComponentBySourceStrings,
    query,
    resolveKey,
    waitFor
};

const styles$1 = ".collapsible {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  border: 1px solid var(--primary-500);\n  border-radius: 4px;\n  overflow: hidden;\n  margin: 1rem 0;\n}\n.collapsible__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5rem 1rem;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n.collapsible__header > span::after {\n  content: \"\";\n  display: inline-block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid var(--interactive-muted);\n  margin-left: 0.5rem;\n}\n.collapsible__header > span::after:hover {\n  border-top-color: var(--interactive-hover);\n}\n.collapsible__content {\n  padding: 0.5rem 1rem;\n  background-color: var(--background-secondary);\n  border-top: 1px solid var(--primary-500);\n}\n.collapsible[data-open=true] > .collapsible__header > span::after {\n  border-top: 5px solid transparent;\n  border-bottom: 5px solid var(--interactive-normal);\n}\n.collapsible[data-disabled=true] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.guild-list-item {\n  display: flex;\n  flex-direction: row;\n  font-size: 24px;\n  align-items: center;\n}\n.guild-list-item__icon {\n  --size: 2rem;\n  width: var(--size);\n  height: var(--size);\n  border-radius: 50%;\n  margin-right: 1ch;\n}\n.guild-list-item__content-container {\n  display: flex;\n  flex-direction: column;\n  font-size: 1rem;\n}\n.guild-list-item__name {\n  font-weight: bold;\n  color: var(--text-primary);\n}\n.guild-list-item__content {\n  color: var(--text-tertiary);\n}\n\n.danho-form-switch {\n  display: flex;\n  flex-direction: row-reverse;\n  align-items: center;\n}\n.danho-form-switch div[class*=note] {\n  margin-top: unset;\n  width: 100%;\n}\n\n.danho-plugin-settings div[class*=divider] {\n  margin: 1rem 0;\n}\n\n.hidden {\n  display: none;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}";

const TextInput = byName("TextInput");

const ScrollerLooks = byKeys(['thin', 'fade']);
const ScrollerAuto = byKeys(['ScrollerAuto']).ScrollerAuto;

const UserProfileBadgeList = Finder.BDFDB_findByStrings(['QUEST_CONTENT_VIEWED', '"PRESS_BADGE"', 'PROFILE_USER_BADGES'], { defaultExport: false }).exports;
const RenderedUserProfileBadgeList = UserProfileBadgeList;
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

function TabBar({ tabs, ...props }) {
    const { noTabsBackground, noContentBackground } = props;
    const [activeTab, _setActiveTab] = React.useState((props.defaultTab ?? tabs.some(([key, value]) => typeof value === 'string' ? value === props.defaultTab : key === props.defaultTab)) ? props.defaultTab : tabs[0][0]);
    const TabContent = typeof props[activeTab] === 'function'
        ? props[activeTab]
        : () => props[activeTab];
    const setActiveTab = React.useCallback((tab) => {
        if (props.beforeTabChange)
            props.beforeTabChange(tab);
        _setActiveTab(tab);
    }, [props.beforeTabChange, props.onTabChange, tabs]);
    React.useEffect(() => {
        if (props.onTabChange)
            props.onTabChange(activeTab);
    }, [activeTab, props.onTabChange]);
    React.useEffect(() => {
        if (!tabs.find(([key]) => key === activeTab)?.[1]) {
            _setActiveTab(tabs[0][0]);
        }
    }, [tabs]);
    return (React.createElement("div", { className: "tab-bar" },
        React.createElement("div", { className: classNames('tab-bar__tabs', noTabsBackground && 'tab-bar__tabs--no-color') }, tabs.map(([tab, title]) => title && React.createElement("button", { className: classNames("tab-bar__tab", activeTab === tab && 'tab-bar__tab--active'), key: tab, onClick: () => setActiveTab(tab) }, title))),
        React.createElement("div", { className: classNames('tab-bar__content', noContentBackground && 'tab-bar__content--no-color') },
            React.createElement(ScrollerAuto, { className: classNames(ScrollerLooks.auto, ScrollerLooks.thin, ScrollerLooks.fade) },
                React.createElement(TabContent, null)))));
}

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
});
const titles = {
    prettyRoles: `Remove role circle, add more color to the roles`,
    defaultRoleColor: `Default role color`,
    groupRoles: `Widen roles that include "roles" in their name to make them stand out as a group`,
    badges: `User badge modifications`,
    movePremiumBadge: `Move the Nitro badge before the Server Boosting badge again`,
    useClientCustomBadges: `Use your own custom badges`,
    pronounsPageLinks: `Turn pronouns.page links into clickable links`,
};
const Badges = createSettings({
    developer: {
        name: 'Plugin Developer',
        iconUrl: 'https://media.discordapp.net/attachments/1005212649212100720/1288452741307433060/PinguDev.png?ex=66f53c9f&is=66f3eb1f&hm=f89e366a09bf6e9a50374e204b680beaca65de941c9f0cc8177f8f4021ec87c7&=&format=webp&quality=lossless&width=18&height=18',
        userTags: [USER_TAGS.DANHO],
        position: {
            before: BadgeTypes.ACTIVE_DEVELOPER,
            default: 0
        },
        size: '16px'
    },
});

function CreateSettingsGroup(callback) {
    return function SettingsGroup(props) {
        const { FormDivider } = FormElements;
        const children = callback(React, props, Setting, FormElements);
        return (React.createElement(React.Fragment, null,
            React.createElement(FormDivider, null),
            children));
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
        React.createElement(Setting, { setting: "movePremiumBadge", ...props })));
});

function SettingsPanel() {
    const [settings, set] = Settings.useState();
    const tabs = Settings.useSelector(({ prettyRoles, badges }) => [
        ['prettyRoles', prettyRoles ? 'Pretty Roles' : null],
        ['badges', badges ? 'Badges' : null]
    ]);
    const settingProps = { settings, set, titles };
    return (React.createElement("div", { className: "danho-plugin-settings" },
        React.createElement(FormSection, { title: "Danho Library Features" },
            React.createElement(FormLabel, null, "Features"),
            React.createElement(Setting, { setting: "prettyRoles", ...settingProps }),
            React.createElement(Setting, { setting: "badges", ...settingProps })),
        tabs.some(([_, value]) => value) && (React.createElement(TabBar, { tabs: tabs, prettyRoles: React.createElement(PrettyRolesSettings, { ...settingProps }), badges: React.createElement(BadgesSettings, { ...settingProps }) }))));
}

const PrettyRolesManager = new class PrettyRolesManager {
    getRole(roleId) {
        return this.context.roles.find(r => r.id === roleId);
    }
    removeRole() {
        if (!this.role)
            return;
        this.context.onRemoveRole(this.role);
    }
    canRemoveRole() {
        if (!this.role)
            return false;
        return this.context.canManageRoles && this.context.highestRole.id !== this.role.id;
    }
};

function afterRoleContextMenu() {
    contextMenu('dev-context', result => {
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
    });
}

const RolesListModule = demangle({
    RolesList: bySource$1('onAddRole')
}, null, true);

function insteadRolesList() {
    instead(RolesListModule, 'RolesList', ({ args, original }) => {
        const result = original(...args);
        PrettyRolesManager.context = result.props.children.props;
        return result;
    });
}

function afterRolesList() {
    after(RolesListModule, 'RolesList', () => {
        $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
            const roleId = el.attr('data-list-item-id')?.split('_').pop();
            if (!roleId)
                return;
            const role = PrettyRolesManager.getRole(roleId);
            el.setStyleProperty('--role-color', hexToRgb(role.colorString
                ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number))).join(','));
            if (Settings.current.groupRoles) {
                const isGroupRole = role.name.toLowerCase().includes('roles');
                if (isGroupRole)
                    el.addClass('danho-library__pretty-roles__group-role');
            }
        });
    });
}

const prettyRoles = "*[role=list][data-list-id*=roles] > div div:has([class*=roleRemoveButton][role=button]),\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveButton][role=button],\n*[role=list][data-list-id*=roles] > div [class*=roleFlowerStar],\n*[role=list][data-list-id*=roles] > div [class*=roleCircle] {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n}\n\n*[role=list][data-list-id*=roles] {\n  padding: 1rem;\n}\n*[role=list][data-list-id*=roles]:has(.danho-library__pretty-roles__group-role) div:has([class*=expandButton]) {\n  flex: 1 1 50%;\n}\n\n*[role=list][data-list-id*=roles] > div {\n  --role-color--default: rgb(86, 105, 118);\n  --role-color: var(--role-color--default);\n  --role-color-alpha: .125;\n  position: relative;\n  border: 1px solid rgb(var(--role-color, --role-color--default));\n  background-color: rgba(var(--role-color, --role-color--default), var(--role-color-alpha));\n  border-radius: 0.25rem;\n  height: 25px;\n  box-sizing: border-box;\n  justify-content: center;\n}\n*[role=list][data-list-id*=roles] > div [class*=roleCircle],\n*[role=list][data-list-id*=roles] > div [class*=roleRemoveIcon] {\n  height: 100%;\n  width: 100%;\n}\n*[role=list][data-list-id*=roles] > div span[class*=roleCircle] {\n  background-color: unset !important;\n}\n*[role=list][data-list-id*=roles] > div svg[class*=roleRemoveIcon] {\n  display: none;\n}\n*[role=list][data-list-id*=roles] > div div:has(svg[class*=roleVerifiedIcon]) {\n  position: absolute;\n  top: -0.5rem;\n  left: -0.75rem;\n}\n*[role=list][data-list-id*=roles] > div:hover svg[class*=roleVerifiedIcon] {\n  display: inline-block !important;\n}\n\n.danho-library__pretty-roles__group-role {\n  flex: 1 1 100% !important;\n  margin-inline: -1rem;\n}";

const isPrettyRolesEnabled = () => Settings.current.prettyRoles;
function Feature$2() {
    if (!isPrettyRolesEnabled())
        return;
    insteadRolesList();
    afterRolesList();
    afterRoleContextMenu();
}

let CustomBadge = null;
function patchBadgeComponent(result) {
    const TooltipWrapper = result.props.children[0].type;
    const TooltipContent = result.props.children[0].props.children.type;
    CustomBadge = ({ name, iconUrl, style }) => {
        if (!name || !iconUrl)
            return null;
        return (React.createElement(TooltipWrapper, { text: name },
            React.createElement(TooltipContent, null,
                React.createElement("img", { src: iconUrl, alt: name, className: result.props.children[0].props.children.props.children[0].props.className, style: style }),
                false)));
    };
}
function insertBadges(result, badgeData) {
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
            ? badges.findIndex(badge => badge.props.text.toLowerCase().includes(badgeType.toLowerCase())) + i
            : -1);
        return startIndex === -1 && endIndex === -1 && position.default === undefined ? badges.length
            : startIndex === -1 && position.default === undefined ? endIndex
                : endIndex === -1 && position.default === undefined ? startIndex
                    : position.default === undefined ? Math.max(startIndex, endIndex) - Math.min(startIndex, endIndex)
                        : position.default ?? badges.length;
    }
}

function afterBadgeList() {
    const { badges: badgesEnabled } = Settings.current;
    if (!badgesEnabled)
        return;
    after(RenderedUserProfileBadgeList, 'Z', ({ result }) => {
        if (!CustomBadge)
            return patchBadgeComponent(result);
        insertBadges(result, Object.values(Badges.current));
    }, { name: 'BadgeList' });
}

function insteadBadgeList() {
    const { badges: badgesEnabled, movePremiumBadge } = Settings.current;
    if (!badgesEnabled || !movePremiumBadge)
        return;
    instead(UserProfileBadgeList, 'Z', ({ args: [props], original: BadgeList }) => {
        if (movePremiumBadge)
            movePremiumBeforeBoost();
        return BadgeList(props);
        function movePremiumBeforeBoost() {
            const nitroBadge = props.badges.find(badge => badge.id.includes(BadgeTypes.NITRO_ANY));
            const boosterBadgePos = props.badges.findIndex(badge => badge.id.includes('booster'));
            if (!nitroBadge || boosterBadgePos === -1)
                return BadgeList(props);
            props.badges.splice(props.badges.indexOf(nitroBadge), 1);
            props.badges.splice(boosterBadgePos - 1, 0, nitroBadge);
        }
    }, { name: 'BadgeList' });
}

function Feature$1() {
    if (!Settings.current.badges)
        return;
    Badges.load();
    insteadBadgeList();
    afterBadgeList();
}

const TextModule = Finder.findBySourceStrings('lineClamp', 'tabularNumbers', 'scaleFontToUserSetting');

function afterTextModule() {
    after(TextModule, 'render', ({ args: [props], result }) => {
        const { className, children: text } = props;
        if (!className || !className.includes('pronounsText'))
            return;
        const regex = text.match(/pronouns\.page\/@(\w+)/);
        if (!regex)
            return;
        const [matched, username] = regex;
        result.props.children = (React.createElement("a", { href: `https://pronouns.page/@${username}`, target: "_blank", rel: "noreferrer noopener" }, matched));
    }, { name: 'TextModule--Pronouns' });
}

function Feature() {
    if (!Settings.current.pronounsPageLinks)
        return;
    afterTextModule();
}

function Features() {
    Feature$2();
    Feature$1();
    Feature();
}
const styles = [
    prettyRoles,
].join("\n\n");

const index = buildPlugin({
    start() {
        Features();
    },
    styles,
    Settings,
    SettingsPanel
});

module.exports = index;

/*@end @*/
