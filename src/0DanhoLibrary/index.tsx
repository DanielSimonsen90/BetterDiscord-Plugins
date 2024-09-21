import DanhoLibrary from '@danho-lib/index';
import { PluginState, Settings } from './Settings';  
import SettingsPanel from './SettingsPanel';

import { Features, styles } from './features';

export default DanhoLibrary({
  start() {
    PluginState.load();
    Features();
  },

  styles,
  Settings,
  SettingsPanel
})