import { ComponentClass, Children } from "@react";
import LibraryComponents from "./LibraryComponents"

type SettingsSaveItem<T = any> = ComponentClass<{
    type: keyof LibraryComponents | keyof HTMLElementTagNameMap
    plugin: any,
    label: string,
    value: T,
    className?: string,
    basis?: string,
    keys?: Array<string>,
    labelChildren?: Children
}>
export default SettingsSaveItem;