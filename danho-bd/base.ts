export class Setting<T> {constructor(public value: T, public description: string) {}}
export class ItemObj {constructor(public id: string, public name: string) {}}
export class Item extends ItemObj {
    constructor(obj: { id: string, name: string } | ItemObj) {
        super(obj.id, obj.name);
    }
}