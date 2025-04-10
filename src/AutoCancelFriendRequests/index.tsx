import { createPlugin } from "@dium";
import { ActionsEmitter } from '@actions';

import subscribeToActions from "./actions";
import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";

export default createPlugin({
	start() {
		subscribeToActions();
		patch();
	},
	
	stop() {
		ActionsEmitter.removeAllListeners();
	},
	
	Settings,
	SettingsPanel,
});