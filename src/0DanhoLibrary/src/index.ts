import { DiscordModules } from './Modules';
import { Libraries } from './Libraries';
import { CreatePluginUtils } from './PluginUtils';
import { Utils } from './Utils';

import { DanhoPlugin } from 'danho-discordium';
import Settings from '../Settings';

export default class DanhoLibrary extends DanhoPlugin<Settings> {
    public Modules = DiscordModules
    public Libraries = Libraries
    public PluginUtils = CreatePluginUtils(this.logger);
    public Utils = Utils
    public GetPlugin<Settings>() {
        return DanhoPlugin;
    }
}