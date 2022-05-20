import IPlugin from "archived/danho-bd/plugins/base/IPlugin";

type DataUtils = {
    get(plugin: IPlugin, key: string): any;
}
export default DataUtils;