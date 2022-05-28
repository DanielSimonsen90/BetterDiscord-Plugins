import { DiscordModules } from './Modules';
import { Libraries } from './Libraries';
import { PluginUtils } from './PluginUtils';
import { Utils } from './Utils';

import { DanhoPlugin } from 'danho-discordium';
import Settings from '../Settings';

export default class DanhoLibrary extends DanhoPlugin<Settings> {
    Modules = DiscordModules
    Libraries = Libraries
    PluginUtils = PluginUtils
    Utils = Utils
}