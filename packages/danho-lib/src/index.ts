import { Utils, UserUtils, GuildUtils } from '@danho-lib/Utils/index';
import * as Stores from '@stores';
import * as Actions from '@actions';
import * as DOM from '@danho-lib/DOM';

import { createPlugin, Plugin, Filters } from '@dium/index';
import * as Finder from '@danho-lib/dium/api/finder';

import styles from './styles/index.scss';

class DanhoLibrary implements Plugin<{}> {
  public Utils = Utils;
  public Users = UserUtils;
  public Guilds = GuildUtils;
  public DOM = DOM;

  public Stores = Stores;
  public Actions = Actions;
  public Finder = Finder;
  public Filters = Filters;

  styles = styles;
};

const LibraryPlugin: DanhoLibrary & Plugin<any> = new DanhoLibrary();
window.DL = LibraryPlugin;
window.Finder = Finder;

declare global {
  interface Window {
    DL: DanhoLibrary;
    Finder: DanhoLibrary['Finder'];
  }
}

export default function buildPlugin<TSettings extends {}>(plugin: Plugin<TSettings>) {
  const built: typeof LibraryPlugin & Plugin<TSettings> = Object.assign({}, LibraryPlugin, plugin);
  built.styles = [LibraryPlugin.styles, plugin.styles].join('\n\n');

  return createPlugin(built);
}
