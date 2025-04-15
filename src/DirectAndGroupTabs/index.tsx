import { createPlugin } from "@dium";
import { $ } from "@dom";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';

const updateNode = () => $(s => s.className('privateChannels', 'nav').and.ariaLabel("Private channels"))?.forceUpdate();
export default createPlugin({
	start() {
		patch();
		updateNode();
	},
	stop() {
		updateNode();
	},

	styles,
	Settings,
	SettingsPanel,
});