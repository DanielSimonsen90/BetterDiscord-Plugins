import DanhoLibrary from '@danho-lib/index';

import { Settings, SettingsPanel } from './Settings';
import { ActionsEmitter } from '@actions';

export default DanhoLibrary({
  start() {

  },
  stop() {
    ActionsEmitter.removeAllListeners();
  },

  Settings,
  SettingsPanel,
});