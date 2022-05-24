import { User } from "@discord";
import { Finder } from "@discordium/api";
import { Module } from "@ZLibrary";
import { Arrayable } from "danholibraryjs";
import { BDFDB } from "./Plugin";

export type If<Condition, Then, Else> = Condition extends true ? Then : Else;
export type PartialRecord<Keys extends string, Values> = Partial<Record<Keys, Values>>;

export const delay = <T>(callback: (...args: any[]) => any, time: number) => new Promise<T>((resolve, reject) => {
    try { setTimeout(() => resolve(callback()), time); } 
    catch (err) { reject(err); }
})

// Make a typescript type that takes in a function as a generic and the function's new return type
export type NewReturnType<
    Function extends (...args: any[]) => any,
    NewReturnType extends any
> = (...args: Parameters<Function>) => NewReturnType;
export type PromisedReturn<
    Function extends (...args: any[]) => any,
> = NewReturnType<Function, Promise<ReturnType<Function>>>;


export const createBDD = () => (window as any).BDD = {
    findNodeByIncludingClassName<NodeType = Element>(className: string, node = document.body): NodeType | null {
        return node.querySelector(`[class*="${className}"]`) as any;
    },
    findModuleByIncludes(displayName: string, returnDisplayNamesOnly = false) {
        const modules = window.ZLibrary.WebpackModules.findAll(match => match?.default?.displayName?.toLowerCase().includes(displayName.toLowerCase()));
        if (!returnDisplayNamesOnly) return modules;
        return modules.map(module => module.default.displayName).sort();
    },
    findClassModuleContainingClass(className: string) {
        const DiscordClassModules = Object.assign({}, window.ZLibrary.DiscordClassModules, window.BDFDB.DiscordClassModules);
        
        return Object.keys(DiscordClassModules).map(key => {
            const property = DiscordClassModules[key];
            if (!property) return null;

            const filtered = Object.keys(property).map(item => {
                const value = property[item];
                return value.toLowerCase().includes(className.toLowerCase()) && [item, value];
            }).filter(v => v);
                
            if (!filtered.length) return null;

            return [key, filtered.reduce((result, [item, value]) => {
                result[item] = value;
                return result;
            }, {} as any)];
        }).filter(v => v).reduce((result, [key, value]) => {
            result[key] = value;
            return result;
        }, {} as any);
    },
    findModule(args: Arrayable<string>, returnDisplayNamesOnly = false) {
        const module: Arrayable<Module> = typeof args === 'string' ? Finder.query({ name: args[0] }) : Finder.query({ props: args })
        if (!module) return module;

        return returnDisplayNamesOnly ? 
            Array.isArray(module) ? 
                module.map(m => m.default?.displayName || m.displayName) :
                module.default?.displayName || module.displayName 
            : module;
    },
    async findUserByTag(tag: string, BDFDB: BDFDB): Promise<User> {
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
}