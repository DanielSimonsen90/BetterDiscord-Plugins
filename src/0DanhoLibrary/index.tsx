import config from './config.json';
import { settings } from './Settings';
import { createPlugin } from 'discordium';
import DanhoLibrary from './src';

class DanhoLibraryGlobal extends DanhoLibrary {
    async start() {
        this.on('plugin-start', this.PluginUtils.startPlugins);
        this.on('plugin-stop', this.PluginUtils.stopPlugins);

        this.emit('plugin-start');
    }
    stop() {
        this.emit('plugin-stop');
    }
}

declare global {
    interface Window { BDD: DanhoLibrary; }
}

export default createPlugin({ ...config, settings }, api => window.BDD = new DanhoLibraryGlobal(api));
