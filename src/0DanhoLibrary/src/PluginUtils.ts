import { DanhoPlugin } from "danho-discordium";
import { delay, If } from "danho-discordium/Utils";
import { Config, createPlugin } from "discordium";
import DanhoLibrary from ".";

class PluginsCollection extends Array<DanhoPlugin> {
    get names() {
        return this.map(plugin => plugin.config.name);
    }
}

export interface IPluginUtils {
    queue: Array<string>;

    startPlugins(): void;
    restartPlugins(): void;
    buildPlugin<Settings = Record<string, any>>(
        config: Config<Settings>, 
        plugin: (
            // BasePlugin: typeof DanhoPlugin<Settings>, 
            Library: DanhoLibrary
        ) => typeof DanhoPlugin
    ): BdApi.PluginConstructor;
    stopPlugins(): void;
    getPlugin<IsArray extends boolean = false>(...pluginNames: Array<string>): If<IsArray, Array<BdApi.Plugin>, BdApi.Plugin>;
}

export const PluginUtils = new class PluginUtils implements IPluginUtils {
    constructor() {
        this.startPlugins = this.startPlugins.bind(this);
        this.restartPlugins = this.restartPlugins.bind(this);
        this.buildPlugin = this.buildPlugin.bind(this);
        this.stopPlugins = this.stopPlugins.bind(this);
        this.getPlugin = this.getPlugin.bind(this);
    }

    private _queue = window.BDD_PluginQueue ?? new Array<string>();
    public get queue() {
        if (this._queue.includes('DanhoLibrary')) {
            console.warn("[PluginUtils]: DanhoLibrary was found in Plugin queue, which is not intended");
            this._queue.splice(this._queue.indexOf('DanhoLibrary'), 1);
        }

        return this._queue;
    }

    public plugins = new PluginsCollection();

    startPlugins() {
        console.log('Starting Danho plugins')
        const { queue } = this;

        while (queue.length > 0) {
            const pluginName = queue.shift();

            try {
                console.log(`[PluginUtils]: Starting plugin ${pluginName}`, BdApi.Plugins.get(pluginName));
                BdApi.Plugins.enable(pluginName);
                const timeout = 100;

                if (!BdApi.Plugins.get(pluginName)) setTimeout(() => {
                    const plugin = BdApi.Plugins.get(pluginName);
                    if (!plugin) return console.warn("[PluginUtils]: Plugin not found", pluginName);

                    if (plugin.instance?.__proto__.constructor.name === 'NoPlugin') {
                        console.warn(`[PluginUtils]: Plugin ${pluginName} is not a valid plugin, reloading...`);
                        BdApi.Plugins.reload(pluginName);
                        delay(() => this.plugins.push(BdApi.Plugins.get(pluginName).instance.plugin as DanhoPlugin), timeout)
                    } else this.plugins.push(plugin.instance.plugin as DanhoPlugin);
                }, timeout);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
    
        console.log('Started Danho plugins')
    }

    restartPlugins(): void {
        console.log('Restarting Danho plugins')
        const queue = BdApi.Plugins.getAll()
            .filter(p => p.author === "Danho#2105")
            .map(p => p.name);
    
        for (const pluginName of queue) {
            try {
                console.log(`[PluginUtils]: Restarting plugin ${pluginName}`);
                BdApi.Plugins.reload(pluginName);
            }
            catch (err) {
                console.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
    }

    buildPlugin<Settings>(config: Config<Settings>, pluginBuilder: (
        // Plugin: typeof DanhoPlugin<Settings>, 
        Library: DanhoLibrary
    ) => typeof DanhoPlugin): BdApi.PluginConstructor {
        const plugin = createPlugin<Settings>(config, api => new (pluginBuilder(window.BDD))(api));
        window.BDD.PluginUtils.queue.push(config.name);
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

    getPlugin<IsArray extends boolean = false>(...pluginNames: Array<string>): If<IsArray, Array<BdApi.Plugin>, BdApi.Plugin> {
        return window.BDD?.Utils.getPlugin<IsArray>(...pluginNames);
    }
}