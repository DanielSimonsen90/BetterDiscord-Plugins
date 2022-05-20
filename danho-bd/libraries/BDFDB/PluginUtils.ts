import { Config, Plugin } from "discordium";
import IPlugin from "archived/danho-bd/plugins/base/IPlugin";
import LibraryComponents from "./LibraryComponents";
import BDFDB from "./BDFDB";

type PluginUtils = {
    createSettingsPanel(plugin: IPlugin, props: {
        collapseStates: {},
        children: Array<JSX.Element> | (() => Array<JSX.Element>)
    }): LibraryComponents["SettingsPanel"];
    buildPlugin(config: Config<any>): [plugin: Plugin<any>, BDFDB: BDFDB],
    cleanUp(plugin: Plugin<any>): void,
}
export default PluginUtils;