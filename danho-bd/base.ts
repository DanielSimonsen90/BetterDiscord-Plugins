import $, { Selector } from 'danho-discordium/dquery';
import { Utils } from 'discordium';

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