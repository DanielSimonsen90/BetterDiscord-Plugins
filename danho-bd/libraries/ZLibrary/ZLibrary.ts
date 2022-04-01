import ContextMenu from './ContextMenu';
import DiscordClassModules from './DiscordClassModules';
import DiscordModules from './DiscordModules';
import { ObservationNode } from '../React'
import { TransformType } from 'danholibraryjs';

export type TooltipCreateOptions = {
    style?: string,
    side?: 'top' | 'bottom' | 'left' | 'right',
    preventFlip?: boolean,
    isTimestamp?: boolean,
    disablePointerEvents?: boolean,
    disabled?: boolean
}

type Module = {
    default?: {
        displayName?: string
    }
}
type ModuleFilter = (module: Module) => boolean;

export type BDMutationRecord = TransformType<MutationRecord, NodeList, Array<ObservationNode>>;

export type ZLibrary = {
    DiscordModules: DiscordModules,
    ContextMenu: ContextMenu,
    DiscordClassModules: DiscordClassModules,
    WebpackModules: {
        find: (filter: ModuleFilter, first?: boolean) => Module | null,
        findAll: (filter: ModuleFilter) => Module[],
        findByUniqueProperties(props: Array<string>, first?: boolean): Module,
        findByDisplayName(name: string): Module,
        getModule(filter: ModuleFilter, first?: boolean): Module | null
        getIndex(filter: ModuleFilter): number | null,
        getIndexByModule(module: Module): number | null,
        getModules(filter: ModuleFilter): Module[],
        getModuleByName(name: string, fallback: ModuleFilter): Module | null,
        getModuleByDisplayName(name: string): Module,
        getByRegex(regex: RegExp): Module,
        getByPrototypes(...prototypes: Array<string>): Module,
        getAllByProps(...props: Array<string>): Module,
        getAllByProps(...props: Array<string>): Module,
        getByString(...props: Array<string>): Module,
        getAllByString(...props: Array<string>): Module,
        getByIndex(index: number): Module,
        getAllModules(): Module[],
    }
}
export default ZLibrary;