import DanhoLibrary from '@danho-lib/index';
import { Settings } from './Settings/Settings';
import SettingsPanel from './Settings/Panel';

import { Features, styles } from './features';
import registerActions from './actions';
import registerPatches from './patches';

import { ActionsEmitter } from '@actions';
import { createSlashCommand, deleteAllSlashCommands } from '@danho-lib/Utils/SlashCommands';

import DiscordBadgeStore from './features/danho-enhancements/badges/stores/DiscordBadgeStore';

export default DanhoLibrary({
  start() {
    Features();
    registerActions();
    registerPatches();

    createSlashCommand({
      name: 'bd-test',
      execute: () => ({
        content: JSON.stringify(DiscordBadgeStore.current, null, 2)
      })
    })    
  },
  stop() {
    ActionsEmitter.removeAllListeners();

    deleteAllSlashCommands();
  },

  styles,
  Settings,
  SettingsPanel
});