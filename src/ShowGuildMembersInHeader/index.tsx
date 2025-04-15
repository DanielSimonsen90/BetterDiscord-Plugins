import { createPlugin } from "@dium";

import patch from "./patches";
import styles from './style.scss';
import updateHeader, { unmountMembersCount } from "./utils/updateHeader";

export default createPlugin({
	start() {
		patch();
		updateHeader();
	},
	stop() {
		unmountMembersCount();
	},

	styles
});