import { DanhoPlugin } from "danho-discordium";
import { delay, If } from "danho-discordium/Utils";
import { Config, createPlugin, Logger } from "discordium";
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

export const CreatePluginUtils = (logger: Logger) => new (class PluginUtils implements IPluginUtils {
    constructor(private _logger: Logger) {
        this.startPlugins = this.startPlugins.bind(this);
        this.restartPlugins = this.restartPlugins.bind(this);
        this.buildPlugin = this.buildPlugin.bind(this);
        this.stopPlugins = this.stopPlugins.bind(this);
        this.getPlugin = this.getPlugin.bind(this);
    }

    private _queue = window.BDD_PluginQueue ?? new Array<string>();
    public get queue() {
        if (this._queue.includes('DanhoLibrary')) {
            this._logger.warn("[PluginUtils]: DanhoLibrary was found in Plugin queue, which is not intended");
            this._queue.splice(this._queue.indexOf('DanhoLibrary'), 1);
        }

        return this._queue;
    }

    public plugins = new PluginsCollection();

    startPlugins() {
        this._logger.group('[PluginUtils]: Starting Danho plugins')
        const { queue } = this;

        while (queue.length > 0) {
            const pluginName = queue.shift();

            try {
                this._logger.log(`[PluginUtils]: Starting plugin ${pluginName}`, {
                    get plugin() {
                        return BdApi.Plugins.get(pluginName);
                    }
                });
                BdApi.Plugins.enable(pluginName);
                const timeout = 100;

                if (!BdApi.Plugins.get(pluginName)) setTimeout(() => {
                    const plugin = BdApi.Plugins.get(pluginName);
                    if (!plugin) return this._logger.warn("[PluginUtils]: Plugin not found", pluginName);

                    if (plugin.instance?.__proto__.constructor.name === 'NoPlugin') {
                        this._logger.warn(`[PluginUtils]: Plugin ${pluginName} is not a valid plugin, reloading...`);
                        BdApi.Plugins.reload(pluginName);
                        delay(() => this.plugins.push(BdApi.Plugins.get(pluginName).instance.plugin as DanhoPlugin), timeout)
                    } 
                    
                    // Upsert plugin
                    const existingPluginIndex = this.plugins.findIndex(p => p.config.name === pluginName);
                    if (existingPluginIndex >= 0) this.plugins[existingPluginIndex] = BdApi.Plugins.get(pluginName).instance.plugin as DanhoPlugin;
                    else this.plugins.push(plugin.instance.plugin as DanhoPlugin);
                    window.BDD_PluginQueue.splice(window.BDD_PluginQueue.indexOf(pluginName), 1);
                }, timeout);
            }
            catch (err) {
                this._logger.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }
    
        this._logger.groupEnd('Started Danho plugins');
    }

    restartPlugins(): void {
        this._logger.group('Restarting Danho plugins')
        const queue = BdApi.Plugins.getAll()
            .filter(p => p.author === "Danho#2105")
            .map(p => p.name);
    
        for (const pluginName of queue) {
            try {
                this._logger.log(`[PluginUtils]: Restarting plugin ${pluginName}`);
                BdApi.Plugins.reload(pluginName);
            }
            catch (err) {
                this._logger.error(`[PluginUtils]: Failed to start plugin ${pluginName}`, err);
            }
        }

        this._logger.groupEnd('Danho plugins restarted');
    }

    buildPlugin<Settings>(config: Config<Settings>, pluginBuilder: (
        // Plugin: typeof DanhoPlugin<Settings>, 
        Library: DanhoLibrary
    ) => typeof DanhoPlugin): BdApi.PluginConstructor {
        const plugin = createPlugin<Settings>(config, api => new (pluginBuilder(window.BDD))(api));
        if (!window.BDD.PluginUtils.queue.includes(config.name)) 
            window.BDD.PluginUtils.queue.push(config.name);
        window.BDD.PluginUtils.startPlugins();
        return plugin;
    }
    
    stopPlugins() {
        this._logger.group('Stopping Danho plugins')
        const { queue } = this;
    
        for (const pluginName of queue) {
            try {
                BdApi.Plugins.disable(pluginName);
            }
            catch (err) {
                this._logger.error(`[PluginUtils]: Failed to stop plugin ${pluginName}`, err);
            }
        }
    
        this._logger.groupEnd('Danho plugins stopped');
    }

    getPlugin<IsArray extends boolean = false>(...pluginNames: Array<string>): If<IsArray, Array<BdApi.Plugin>, BdApi.Plugin> {
        return window.BDD?.Utils.getPlugin<IsArray>(...pluginNames);
    }
})(logger);