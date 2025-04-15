import { createPlugin } from "@dium";
import { $ } from "@dom";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import loadStores from "./stores";
import styles from './styles/index.scss';

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