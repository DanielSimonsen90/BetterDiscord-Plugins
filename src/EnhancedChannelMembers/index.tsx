import { createPlugin } from "@dium";
import { ActionsEmitter } from '@actions';
import { $ } from "@dom";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './styles/index.scss';

const updateNode = () => $(s => s.className('chatContent', 'main').sibling.className('container'))?.forceUpdate();

export default createPlugin({
	start() {
		patch();
		updateNode();
	},
	
	stop() {
		ActionsEmitter.removeAllListeners();
		updateNode();
	},
	
	styles,
	Settings,
	SettingsPanel,
});