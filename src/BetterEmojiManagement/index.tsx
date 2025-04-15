import { createPlugin, Patcher } from "@dium";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './styles/index.scss';

function updatePatches() {
  Patcher.unpatchAll();
  patch();
}

export default createPlugin({
  start() {
    patch();
  },

  styles,
  Settings,
  SettingsPanel: () => SettingsPanel({ updatePatches })
});