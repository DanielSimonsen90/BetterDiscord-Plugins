import DanhoLibrary from '@danho-lib/index';
import { Settings } from './Settings';  
import SettingsPanel from './SettingsPanel';

import { Features, styles } from './features';

export default DanhoLibrary({
  start() {
    Features();
  },

  styles,
  Settings,
  SettingsPanel
})