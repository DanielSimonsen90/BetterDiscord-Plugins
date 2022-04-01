import IPlugin from "../../../plugins/base/IPlugin"
import { Component, Children } from "../../React"
import LibraryComponents from "./LibraryComponents"

type SettingsSaveItem<T = any> = Component<{
    type: keyof LibraryComponents | keyof HTMLElementTagNameMap
    plugin: IPlugin,
    label: string,
    value: T,
    className?: string,
    basis?: string,
    keys?: Array<string>,
    labelChildren?: Children
}>
export default SettingsSaveItem;