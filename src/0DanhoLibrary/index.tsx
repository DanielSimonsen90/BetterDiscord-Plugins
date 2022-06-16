import config from './config.json';
import { settings } from './Settings';
import { createPlugin } from 'discordium';
import DanhoLibrary from './src';
import { delay } from 'danho-discordium/Utils';

class DanhoLibraryGlobal extends DanhoLibrary {
    async start() {
        this.on('plugin-start', this.PluginUtils.startPlugins);
        this.on('plugin-restart', this.PluginUtils.restartPlugins);
        this.on('plugin-stop', this.PluginUtils.stopPlugins);

        this.emit('plugin-restart');

        if (!window.BDFDB || !window.BDFDB_Global.loaded) {
            this.logger.log('Waiting for BDFDB to load...');

            const waitForBDFDB = async () => {
                if (!window.BDFDB || !window.BDFDB_Global.loaded) {
                    return delay(waitForBDFDB, 1000);
                }

                this.logger.log('BDFDB loaded.');
                this.stop();
                await delay(this.start, 100);
            };

            waitForBDFDB();
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
