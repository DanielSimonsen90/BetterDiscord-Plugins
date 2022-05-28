import Component from "danho-discordium/components/Component";
import { Children } from "@lib/React"
import LibraryComponents from "./LibraryComponents"

type SettingsSaveItem<T = any> = Component<{
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