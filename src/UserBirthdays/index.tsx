import { createPlugin } from "@dium";
import { $ } from "@dom";

import registerCommands from "./commands";
import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import loadStores from "./stores";
import styles from './styles/index.scss';
import { SlashCommandUtils } from "@utils";

const updateNode = () => $(s => s.ariaLabel("Private channels", 'nav'))?.forceUpdate();

export default createPlugin({
	start() {
		registerCommands();
		patch();
		loadStores();

		updateNode();
	},
	stop() {
		SlashCommandUtils.unregisterAllSlashCommands();
		updateNode();
	},
	
	styles,
	Settings,
	SettingsPanel,
});