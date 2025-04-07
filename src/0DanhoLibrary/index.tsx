import DanhoLibrary from '@danho-lib/index';
import { Settings } from './Settings/Settings';
import SettingsPanel from './Settings/Panel';

import { Features, styles } from './features';
import registerActions from './actions';
import registerPatches from './patches';

import { ActionsEmitter } from '@actions';

export default DanhoLibrary({
  start() {
    Features();
    registerActions();
    registerPatches();

    test();
  },
  stop() {
    ActionsEmitter.removeAllListeners();
  },

  styles,
  Settings,
  SettingsPanel,
});

function test() {

}