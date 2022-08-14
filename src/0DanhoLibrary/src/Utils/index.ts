import { Arrayable } from "danholibraryjs";
import BDFDB from '@BDFDB';
import { User } from '@discord';
import ZLibrary, { Module } from "@ZLibrary";
import { Finder } from "@discordium/api";
import { If } from "danho-discordium/Utils";

function findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
    return node.querySelector(`[class*="${className}"]`) as any;
}
function findModuleByIncludes(displayNameOrProps: Arrayable<string>, returnDisplayNamesOnly = false) {
    const modules = typeof displayNameOrProps === 'string' ? 
        window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayNameOrProps.toLowerCase())) :
        window.ZLibrary.WebpackModules.findAll(match => match && Object.keys({ ...match, ...(match.default ?? {}) })
            .filter(key => displayNameOrProps.some(prop => key.toLowerCase().includes(prop.toLowerCase())))
            .length > 0
        );
    
    if (!returnDisplayNamesOnly) return modules;
    return modules.map(module => module.default.displayName).sort();
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
    const module: Arrayable<Module> = typeof args === 'string' ? Finder.query({ name: args }) : Finder.query({ props: args })
    if (!module) return module;

    return returnDisplayNamesOnly ? 
        Array.isArray(module) ? 
            module.map(m => m.default?.displayName || m.displayName) :
            module.default?.displayName || module.displayName 
        : module;
}
function findStore(storeName: string, allowMultiple = false) {
    const result = Object.values<any>(
        window.BDD.finder.byName("UserSettingsAccountStore")
        ._dispatcher._actionHandlers._dependencyGraph.nodes
    ).sort((a, b) => a.name.localeCompare(b.name))
    .filter(s => s.name.toLowerCase().includes(storeName.toLowerCase()));

    return allowMultiple ? result : result[0];
}

async function findUserByTag(tag: string, BDFDB: BDFDB): Promise<User> {
    return new Promise((resolve, reject) => {
        console.time(`Looking for ${tag}`);
        for (let i = 0; i < 9999; i++) {
            const discriminator = i < 9 ? `000${i}` : i < 99 ? `00${i}` : i < 999 ? `0${i}` : i.toString();
            const user = BDFDB.LibraryModules.UserStore.findByTag(tag, discriminator);
            if (user) {
                console.timeEnd(`Looking for ${tag}`);
                return resolve(user);
            }
        }
        console.timeEnd(`Looking for ${tag}`);
        reject(`Could not find user with tag ${tag}`);
    })
}
function getPlugin<IsArray extends boolean = false>(...pluginNames: Array<string>): If<IsArray, Array<BdApi.Plugin>, BdApi.Plugin> {
    return pluginNames.length === 1 ? 
        BdApi.Plugins.get(pluginNames[0]).instance.plugin as any :
        BdApi.Plugins.getAll().filter(plugin => pluginNames.includes((
            plugin['name'] || plugin['getName']?.()
        ))).map(plugin => plugin.instance.plugin as any);
}

function currentUser() {
    return window.BDFDB.UserUtils.me;
}

function currentGuild() {
    const guildId = ZLibrary.DiscordModules.SelectedGuildStore.getGuildId();
    return guildId ? ZLibrary.DiscordModules.GuildStore.getGuild(guildId) : null;
}
function currentChannel() {
    const channelId = ZLibrary.DiscordModules.SelectedChannelStore.getChannelId();
    return channelId ? ZLibrary.DiscordModules.ChannelStore.getChannel(channelId) : null;
}
function currentGuildMembers() {
    const guildId = currentGuild()?.id;
    return guildId ? ZLibrary.DiscordModules.GuildMemberStore.getMembers(guildId) : null;
}

export const Utils = {
    findNodeByIncludingClassName,
    findModuleByIncludes,
    findClassModuleContainingClass,
    findModule,
    findUserByTag,
    findStore,
    getPlugin,

    get currentUser() { return currentUser() },
    get currentGuild() { return currentGuild() },
    get currentChannel() { return currentChannel() },
    get currentGuildMembers() { return currentGuildMembers() },
}

export * from './Users';
export * from './Guilds';

/**
 * Object.values(ZLibrary.WebpackModules.getAllModules()).filter(m => m.id === 401648)[0].exports;
 */

