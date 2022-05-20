import BDFDB from '@BDFDB';
import PluginUtils from '@lib/BDFDB/PluginUtils';
import ZLibrary from '@ZLibrary';
import $, { Selector } from 'danho-discordium/dquery';
import { Config, Utils } from 'discordium';

export class Setting<T> {constructor(public value: T, public description: string) {}}
export class ItemObj {constructor(public id: string, public name: string) {}}
export class Item extends ItemObj {
    constructor(obj: { id: string, name: string } | ItemObj) {
        super(obj.id, obj.name);
    }
}

export function forceRerender(selector: Selector) {
    const fiber = $(selector).fiber;
    if (!fiber) return false;
    return Utils.forceFullRerender(fiber);
}

declare global {
    interface Window {
        BDFDB_Global: {
            PluginUtils: Pick<PluginUtils, 'buildPlugin' | 'cleanUp'>,
            info: Pick<Config<any>, 'author' | 'description' | 'name' | 'version'>,
            loaded: boolean,
            rawUrl: "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.plugin.js",
            started: boolean
        },
        BDFDB: BDFDB,
        ZLibrary: ZLibrary
    }
}