import { Utils, UserUtils, GuildUtils } from '@danho-lib/Utils/index';
import * as Stores from '@danho-lib/Stores';
import * as Actions from '@danho-lib/Actions';

import { createPlugin, Plugin, Finder, Filters, createSettings, Logger } from '@dium/index';
import { React } from '@dium/modules';

import styles from './styles/index.scss';

export * as Components from './React/components';
export * as Patcher from './Patcher';

class DanhoLibrary implements Plugin<{}> {
  public Utils = Utils;

  public Users = UserUtils;
  public Guilds = GuildUtils;

  public Stores = Stores;
  public Actions = Actions;
  public Finder = Finder;
  public Filters = Filters;

  styles = styles;
};

const LibraryPlugin: DanhoLibrary & Plugin<any> = new DanhoLibrary();
window.DL = LibraryPlugin;

declare global {
  interface Window {
    DL: DanhoLibrary;
  }
}

export default function buildPlugin<TSettings extends {}>(plugin: Plugin<TSettings>) {
  const built: typeof LibraryPlugin & Plugin<TSettings> = Object.assign({}, LibraryPlugin, plugin);
  built.styles = [LibraryPlugin.styles, plugin.styles].join('\n\n');

  return createPlugin(built);
}
