import { createPlugin } from "@dium";
import { ActionsEmitter } from '@actions';

import patch from './patches';

export default createPlugin({
	start() {
		patch();
	},

	stop() {
		ActionsEmitter.removeAllListeners();
	},
});