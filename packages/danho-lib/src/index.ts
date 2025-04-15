import * as Actions from './Actions';
import * as DOM from './DOM';
import { Finder, Patcher } from './Injections';
import * as Stores from './Stores';
import { Utils } from './Utils';

import { createPlugin, Plugin, Filters } from '@dium';
import * as DiscordStores from '@discord/stores';

import styles from './styles/index.scss';

class DanhoLibrary implements Plugin<{}> {
  public Utils = Utils;
  public DOM = DOM;

  public Stores = Object.assign({}, DiscordStores, Stores);
  public Actions = Actions;
  public Finder = Finder;
  public Filters = Filters;
  public Patcher = Patcher;

  public styles = styles;
};

const LibraryPlugin: DanhoLibrary & Plugin<any> = new DanhoLibrary();
window.DL = LibraryPlugin;
window.Finder = Finder;

declare global {
  interface Window {
    DL: DanhoLibrary;
    Finder: DanhoLibrary['Finder'];
    GLOBAL_ENV: Record<string, any>;
  }
}

export default function buildPlugin<TSettings extends {}>(plugin: Plugin<TSettings>) {
  const built: typeof LibraryPlugin & Plugin<TSettings> = Object.assign({}, LibraryPlugin, plugin);
  built.styles = [LibraryPlugin.styles, plugin.styles].join('\n\n');

  return createPlugin(built);
}
