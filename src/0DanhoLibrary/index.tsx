import { DiscordModules } from './Modules';
import { Utils, UserUtils, GuildUtils } from './Utils';

import * as Components from '@danho-lib/React/components';
import * as Stores from '@danho-lib/Stores';
import * as Actions from '@danho-lib/Actions';
import { createPlugin, Plugin } from '@dium/index';
import { Finder, Filters } from '@dium/index';

import styles from '../../packages/danho-lib/src/styles/index.scss';

type Settings = {}

const LibraryPlugin = new class DanhoLibrary implements Plugin<Settings> {
    public Modules = DiscordModules
    
    public Utils = Utils

    public Users = UserUtils;
    public Guilds = GuildUtils;

    public Stores = Stores;
    public Actions = Actions;
    public Components = Components;
    public Finder = Finder;
    public Filters = Filters;

    start() {}
    
    styles = styles;
};

window.DL = LibraryPlugin;
export default createPlugin(LibraryPlugin);

declare global {
    interface Window {
        DL: typeof LibraryPlugin
    }
}