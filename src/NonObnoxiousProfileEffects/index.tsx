import { createPlugin } from "@dium";
import { $ } from "@danho-lib/DOM";

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