import { Utils, UserUtils, GuildUtils } from '@danho-lib/Utils/index';
import * as Stores from '@danho-lib/Stores';
import * as Actions from '@danho-lib/Actions';

import { createPlugin, Plugin } from '@dium/index';
import { Finder, Filters } from '@dium/index';

import styles from './styles/index.scss';

export * as Components from './React/components';
export * as Patcher from './Patcher';

const LibraryPlugin = new class DanhoLibrary implements Plugin<{}> {
  public Utils = Utils;

  public Users = UserUtils;
  public Guilds = GuildUtils;

  public Stores = Stores;
  public Actions = Actions;
  public Finder = Finder;
  public Filters = Filters;

  start() {}

  styles = styles;
};

window.DL = LibraryPlugin;
export default createPlugin(LibraryPlugin);


declare global {
  interface Window {
    DL: typeof LibraryPlugin;
  }
}