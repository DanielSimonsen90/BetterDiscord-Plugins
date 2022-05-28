import config from './config.json';
import Settings, { settings } from './Settings';
import { DanhoPlugin } from 'danho-discordium';
import { createPlugin } from 'discordium';

import {
    DiscordModules,
    Libraries,
    PluginUtils,

    Utils,
} from './src';

export class DanhoLibrary extends DanhoPlugin<Settings> {
    Modules = DiscordModules
    Libraries = Libraries
    PluginUtils = PluginUtils
    Utils = Utils
}

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