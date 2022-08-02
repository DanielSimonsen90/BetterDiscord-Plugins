import { Arrayable } from "danholibraryjs";
import BDFDB from '@BDFDB';
import { User } from '@discord';
import { Module } from "@ZLibrary";
import { Finder } from "@discordium/api";
import { If } from "danho-discordium/Utils";

function findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
    return node.querySelector(`[class*="${className}"]`) as any;
}
function findModuleByIncludes(displayName: string, returnDisplayNamesOnly = false) {
    const modules = window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
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

export const Utils = {
    findNodeByIncludingClassName,
    findModuleByIncludes,
    findClassModuleContainingClass,
    findModule,
    findUserByTag,
    getPlugin
}
