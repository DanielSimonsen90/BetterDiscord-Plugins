import { Arrayable } from "danholibraryjs";
import { Finder } from "@dium/api";
import { GuildStore, GuildMemberStore } from '@dium/modules/guild';
import { SelectedChannelStore, ChannelStore } from '@dium/modules/channel';
import { SelectedGuildStore } from '@stores/SelectedGuildStore';

function findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
    return node.querySelector(`[class*="${className}"]`) as any;
}

function findClassModuleContainingClass(className: string) {
    type Lib = Record<string, Record<string, string>>;

    const DiscordClassModules: Array<[string, Lib]> = ["ZLibrary", "BDFDB"].map(name => [name, window[name].DiscordClassModules]);
    const findModule = (key: string, lib: Lib): [moduleTitle: string, module: any] => {
        const module = lib[key];
        if (!module) return null;

        const filtered = Object.entries(module).map(([moduleKey, value]) => {
            return value.toLowerCase().includes(className.toLowerCase()) && [moduleKey, value];
        }).filter(v => v);
            
        if (!filtered.length) return null;

        return [key, filtered.reduce((result, [item, value]) => {
            result[item] = value;
            return result;
        }, {} as any)];
    }

    return DiscordClassModules.map(([name, lib]) => [name, Object
        .keys(lib)
        .map(k => findModule(k, lib))
        .filter(v => v)
        .reduce((result, [moduleTitle, module]) => {
            result[moduleTitle] = module;
            return result;
        }, {} as any)]
    ).reduce((result, [name, modules]) => {
        result[name] = modules;
        return result;
    }, {} as any);
}
function findModule(args: Arrayable<string>, returnDisplayNamesOnly = false) {
    const module: Arrayable<any> = typeof args === 'string' ? Finder.query({ name: args }) : Finder.query({ keys: args })
    if (!module) return module;

    return returnDisplayNamesOnly ? 
        Array.isArray(module) ? 
            module.map(m => m.default?.displayName || m.displayName) :
            module.default?.displayName || module.displayName 
        : module;
}
function findStore(storeName: string, allowMultiple = false) {
    const result = Object.values<any>(
        Finder.byName("UserSettingsAccountStore")
        ._dispatcher._actionHandlers._dependencyGraph.nodes
    ).sort((a, b) => a.name.localeCompare(b.name))
    .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));

    return allowMultiple ? result : result[0];
}

function currentGuild() {
    const guildId = SelectedGuildStore.getGuildId();
    return guildId ? GuildStore.getGuild(guildId) : null;
}
function currentChannel() {
    // @ts-ignore WARN: what is "e"
    const channelId = SelectedChannelStore.getChannelId(); 
    return channelId ? ChannelStore.getChannel(channelId) : null;
}
function currentGuildMembers() {
    const guildId = currentGuild()?.id;
    return guildId ? GuildMemberStore.getMembers(guildId) : null;
}

export const Utils = {
    findNodeByIncludingClassName,
    findClassModuleContainingClass,
    findModule,
    findStore,

    // get currentUser() { return currentUser() },
    get currentGuild() { return currentGuild() },
    get currentChannel() { return currentChannel() },
    get currentGuildMembers() { return currentGuildMembers() },
}

export * from './Users';
export * from './Guilds';