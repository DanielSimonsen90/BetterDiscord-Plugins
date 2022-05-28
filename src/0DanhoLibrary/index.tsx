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

// @ts-ignore
const Plugin = createPlugin({ ...config, settings }, api => new DanhoLibraryGlobal(api));
window.BDD = new Plugin() as DanhoLibraryGlobal;

export default Plugin;