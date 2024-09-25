import DanhoLibrary from '@danho-lib/index';
import { Settings } from './Settings/Settings';  
import SettingsPanel from './Settings/Panel';

import { Features, styles } from './features';

export default DanhoLibrary({
  start() {
    Features();
  },

  styles,
  Settings,
  SettingsPanel
})