import IPlugin from "../../plugins/base/IPlugin";
import { Component } from "../React";
import LibraryComponents from "./LibraryComponents";

type PluginUtils = {
    createSettingsPanel(plugin: IPlugin, props: {
        collapseStates: {},
        children: Array<JSX.Element> | (() => Array<JSX.Element>)
    }): LibraryComponents["SettingsPanel"];
}
export default PluginUtils;