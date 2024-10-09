import { createPlugin, Patcher, getMeta } from "@dium";

import patch from "./patches";

import { Settings, titles } from "./Settings";
import SettingsPanel from "./SettingsPanel";
import styles from './styles/index.scss';

function updatePatches() {
  Patcher.unpatchAll();
  patch();
}

export default createPlugin({
  start() {
    patch();

    if (Settings.current.enableBannedEmojis && !Settings.current.acceptBannedEmojisBeta) {
      const closeNotice = BdApi.UI.showNotice(titles.acceptBannedEmojisBeta, {
        type: 'warning',
        buttons: [{
          label: 'Disable plugin',
          onClick: () => {
            BdApi.Plugins.disable(getMeta().name);
            closeNotice(false);
          }
        }, {
          label: 'Disable feature',
          onClick: () => {
            Settings.update({ enableBannedEmojis: false });
            closeNotice(false);
          }
        }, {
          label: 'I understand',
          onClick: () => {
            Settings.update({ acceptBannedEmojisBeta: true });
            closeNotice(false);
          }
        }]
      });
    }
  },

  styles,
  Settings,
  SettingsPanel: () => SettingsPanel({ updatePatches })
});