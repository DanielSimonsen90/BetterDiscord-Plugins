import { DanhoPlugin } from "danho-discordium";
import { Config, createPlugin } from "discordium";
import DanhoLibrary from ".";

class PluginReturn extends DanhoPlugin {}

export type PluginUtils = {
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

export const PluginUtils = {
    queue: new Array<string>(),

    startPlugins(this: PluginUtils) {
        const { queue } = this;

        for (const pluginName of queue) {
            try {
                BdApi.Plugins.enable(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
                return false;
            }
        }
        return true;
    },

    buildPlugin<Settings>(this: PluginUtils, config: Config<Settings>, pluginBuilder: (
        Plugin: typeof DanhoPlugin, 
        Library: DanhoLibrary
    ) => typeof PluginReturn): BdApi.PluginConstructor {
        class Wrapper extends DanhoPlugin<Settings> {}
        
        const plugin = createPlugin<Settings>(config, api => new (pluginBuilder(Wrapper as any, window.BDD))(api));
        window.BDD.PluginUtils.queue.push(config.name);
        // @ts-ignore
        window.BDD.PluginUtils.startPlugins();
        return plugin;
    },

    stopPlugins(this: PluginUtils) {
        const { queue } = this;

        for (const pluginName of queue) {
            try {
                BdApi.Plugins.disable(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to stop plugin ${pluginName}`, err);
            }
        }
    }
}