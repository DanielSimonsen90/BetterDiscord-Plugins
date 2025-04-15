import { createPlugin } from "@dium";
import { $ } from "@dom";

import styles from './style.scss';
import { Settings, SettingsPanel } from './Settings';

export default createPlugin({
  start() {
    $('#app-mount')
      .addClass('danho-non-obnoxious-profile-effects')
      .setStyleProperty('--opacity', Settings.current.opacity.toString());
  },

  styles,
  Settings,
  SettingsPanel,
});