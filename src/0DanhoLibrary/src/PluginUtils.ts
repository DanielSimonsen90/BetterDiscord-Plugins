import { DanhoPlugin } from "danho-discordium";
import { Config, createPlugin } from "discordium";
import DanhoLibrary from ".";

class PluginReturn extends DanhoPlugin {}

export interface IPluginUtils {
    queue: Array<string>;

    startPlugins(): void
    buildPlugin<Settings = Record<string, any>>(
        config: Config<Settings>, 
        plugin: (
            BasePlugin: typeof DanhoPlugin, 
            Library: DanhoLibrary
        ) => typeof PluginReturn
    ): BdApi.PluginConstructor;
    stopPlugins(): void;
}

export const PluginUtils = new class PluginUtils implements IPluginUtils {
    constructor() {
        this.startPlugins = this.startPlugins.bind(this);
        this.buildPlugin = this.buildPlugin.bind(this);
        this.stopPlugins = this.stopPlugins.bind(this);
    }

    queue = window.BDD_PluginQueue ?? new Array<string>();

    startPlugins() {
        console.log('Starting Danho plugins')
        const { queue } = this;
    
        for (const pluginName of queue) {
            try {
                BdApi.Plugins.enable(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
    
        console.log('Started Danho plugins')
    }

    buildPlugin<Settings>(config: Config<Settings>, pluginBuilder: (
        Plugin: typeof DanhoPlugin, 
        Library: DanhoLibrary
    ) => typeof PluginReturn): BdApi.PluginConstructor {
        class Wrapper extends DanhoPlugin<Settings> {}
        
        const plugin = createPlugin<Settings>(config, api => new (pluginBuilder(Wrapper as any, window.BDD))(api));
        window.BDD.PluginUtils.queue.push(config.name);
        // @ts-ignore
        window.BDD.PluginUtils.startPlugins();
        return plugin;
    }
    
    stopPlugins() {
        console.log('Stopping Danho plugins')
        const { queue } = this;
    
        for (const pluginName of queue) {
            try {
                BdApi.Plugins.disable(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to stop plugin ${pluginName}`, err);
            }
        }
    
        console.log('Danho plugins stopped')
    }
}