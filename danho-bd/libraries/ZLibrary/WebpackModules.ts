import { Module } from "./ZLibrary";

export type ModuleFilter = (module: Module) => boolean;
export type WebpackModules = {
    find(filter: ModuleFilter, first?: boolean): Module | null,
    findAll(filter: ModuleFilter): Module[],
    findByUniqueProperties(props: Array<string>, first?: boolean): Module,
    findByDisplayName(name: string): Module,

    getByDisplayName(name: string, fallback?: ModuleFilter): Module | null
    getModule(filter: ModuleFilter, first?: boolean): Module | null
    getIndex(filter: ModuleFilter): number | null,
    getIndexByModule(module: Module): number | null,
    getModules(filter: ModuleFilter): Module[],
    getModuleByName(name: string, fallback?: ModuleFilter): Module | null,

    getByRegex(regex: RegExp): Module,
    
    getByPrototypes(...prototypes: Array<string>): Module,
    getAllByPrototypes(...props: Array<string>): Module,
    
    getByProps(...props: Array<string>): Module,
    getAllByProps(...props: Array<string>): Module,
    
    getByString(...props: Array<string>): Module,
    getAllByString(...props: Array<string>): Module,
    
    getByIndex(index: number): Module,
    getAllModules(): Module[],
}
export default WebpackModules;