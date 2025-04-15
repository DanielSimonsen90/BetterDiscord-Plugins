import { createPlugin } from "@dium";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';

export default createPlugin({
	start() {
		patch();
	},
	
	styles,
	Settings,
	SettingsPanel,
});