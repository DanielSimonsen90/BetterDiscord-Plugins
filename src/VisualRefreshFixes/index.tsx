import { createPlugin } from "@dium";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';
import { $ } from "@danho-lib/DOM";
import getClassName from "./utils/getClassName";

const defaultAppMountClass = $('#app-mount').attr('class');

export default createPlugin({
	start() {
		patch();

		$('#app-mount').attr('class', getClassName());
	},

	stop() {
		$('#app-mount').prop('class', defaultAppMountClass);
	},

	styles,
	Settings,
	SettingsPanel,
});