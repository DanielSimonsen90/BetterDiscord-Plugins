import IPlugin from "archived/danho-bd/plugins/base/IPlugin";
import LibraryComponents from "./LibraryComponents";

type PluginUtils = {
    createSettingsPanel(plugin: IPlugin, props: {
        collapseStates: {},
        children: Array<JSX.Element> | (() => Array<JSX.Element>)
    }): LibraryComponents["SettingsPanel"];
}
export default PluginUtils;