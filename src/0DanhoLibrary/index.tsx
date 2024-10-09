import DanhoLibrary from '@danho-lib/index';
import { Settings } from './Settings/Settings';  
import SettingsPanel from './Settings/Panel';

import { Features, styles } from './features';
import { ActionsEmitter } from '@actions';

export default DanhoLibrary({
  start() {
    Features();
  },
  stop() {
    ActionsEmitter.removeAllListeners();
  },

  styles,
  Settings,
  SettingsPanel
})