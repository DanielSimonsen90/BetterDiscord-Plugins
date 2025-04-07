import { createPlugin } from "@dium";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';
import loadStores from "./stores";

export default createPlugin({
	start() {
		patch();
		loadStores();
	},
  
	styles,
	Settings,
	SettingsPanel,
});