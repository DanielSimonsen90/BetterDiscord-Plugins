import { Selector } from 'danho-discordium/dquery';
import { Utils } from 'discordium';

export class Setting<T> {constructor(public value: T, public description: string) {}}
export class ItemObj {constructor(public id: string, public name: string) {}}
export class Item extends ItemObj {
    constructor(obj: { id: string, name: string } | ItemObj) {
        super(obj.id, obj.name);
    }
}

export function forceRerender(selectorOrNode: Selector) {
    const element = selectorOrNode instanceof Node ? selectorOrNode : document.querySelector(selectorOrNode.toString());
    if (!element) return;

    const fiber = Utils.getFiber(element);
    return Utils.forceFullRerender(fiber);
}