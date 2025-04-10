import { createPlugin } from "@dium";
import { $ } from "@danho-lib/DOM";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import loadStores from "./stores";
import styles from './style.scss';
import HiddenChannelStore from "./stores/HiddenChannelStore";

const updateNode = () => $(s => s.className('container', 'nav').and.ariaLabel(' (server)').lastChild('div'))?.forceUpdate();

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