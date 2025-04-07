import { createPlugin } from "@dium";

import subscribeToActions from "./actions";
import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';
import { ActionsEmitter } from "@actions";

export default createPlugin({
	start() {
		subscribeToActions();
		patch();
	},

	stop() {
		ActionsEmitter.removeAllListeners();
	},
  
	styles,
	Settings,
	SettingsPanel,
});