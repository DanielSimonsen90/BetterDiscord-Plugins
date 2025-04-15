import { createPlugin } from "@dium";
import { ActionsEmitter } from '@actions';

import subscribeToActions from "./actions";
import patch from "./patches";

export default createPlugin({
	start() {
		subscribeToActions();
		patch();
	},
	
	stop() {
		ActionsEmitter.removeAllListeners();
	},
});