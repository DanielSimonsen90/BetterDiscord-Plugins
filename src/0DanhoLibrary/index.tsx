import config from './config.json';
import { settings } from './Settings';
import { createPlugin } from 'discordium';
import DanhoLibrary from './src';
import { delay } from 'danho-discordium/Utils';

class DanhoLibraryGlobal extends DanhoLibrary {
    async start() {
        this.on('plugin-start', this.PluginUtils.startPlugins);
        this.on('plugin-stop', this.PluginUtils.stopPlugins);

        this.emit('plugin-start');

        if (!window.BDFDB || !window.BDFDB_Global.loaded) {
            delay(() => this.stop(), 500).then(() => delay(() => this.start(), 100));
        }
    }
    stop() {
        this.emit('plugin-stop');
    }
}

declare global {
    interface Window {
        BDD: DanhoLibrary;
        BDD_PluginQueue: Array<string>;
    }
}

export default createPlugin({ ...config, settings }, api => {
    const plugin = new DanhoLibraryGlobal(api);
    window.BDD ??= plugin;
    return plugin;
});
