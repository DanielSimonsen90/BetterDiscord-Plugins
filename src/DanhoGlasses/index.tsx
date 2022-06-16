import styles from './styles/index.scss';
import config from './config.json';

type Settings = {

}

export default window.BDD.PluginUtils.buildPlugin<Settings>({ ...config, styles }, (BasePlugin, Lib) => {
    const Plugin = BasePlugin;
    const { createStyles } = Lib.Libraries.Discordium;

    return class DanhoGlasses extends Plugin {

    }
});