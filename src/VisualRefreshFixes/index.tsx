import { createPlugin } from "@dium";
import { classNames } from "@react";
import { $ } from "@danho-lib/DOM";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './style.scss';
import getClassName from "./utils/getClassName";

let defaultAppMountClass = $('#app-mount').attr('class');

export default createPlugin({
	start() {
		patch();

		defaultAppMountClass = $('#app-mount').attr('class');
		$('#app-mount').attr('class', classNames(defaultAppMountClass, getClassName()));
	},

	stop() {
		$('#app-mount').attr('class', defaultAppMountClass);
	},

	styles,
	Settings,
	SettingsPanel,
});