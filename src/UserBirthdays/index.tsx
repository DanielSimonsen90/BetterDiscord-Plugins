import { createPlugin } from "@dium";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import loadStores from "./stores";
import styles from './style.scss';
import { $ } from "@danho-lib/DOM";

const updateNode = () => $(s => s.ariaLabel("Private channels", 'nav'))?.forceUpdate();

export default createPlugin({
	start() {
		patch();
		loadStores();

		updateNode();
	},
	stop() {
		updateNode();
	},
	
	styles,
	Settings,
	SettingsPanel,
});