import { DiscordModules } from './Modules';
import { Libraries } from './Libraries';
import { PluginUtils } from './PluginUtils';
import { Utils } from './Utils';

import { DanhoPlugin } from 'danho-discordium';
import Settings from '../Settings';

export default class DanhoLibrary extends DanhoPlugin<Settings> {
    public Modules = DiscordModules
    public Libraries = Libraries
    public PluginUtils = PluginUtils
    public Utils = Utils
}