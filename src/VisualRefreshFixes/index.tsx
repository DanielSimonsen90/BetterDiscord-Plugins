import { createPlugin } from "@dium";
import { classNames } from "@react";
import { $ } from "@dom";

import patch from "./patches";
import { Settings, SettingsPanel } from "./settings";
import styles from './styles/index.scss';
import getClassName from "./utils/getClassName";

let defaultAppMountClass = $('#app-mount').attr('class');
const updatePrivateChannelsNode = () => $(s => s.ariaLabel('Private channels', 'nav').and.className('privateChannels'))?.forceUpdate();

export default createPlugin({
	start() {
		patch();

		defaultAppMountClass = $('#app-mount').attr('class');
		$('#app-mount').attr('class', classNames(defaultAppMountClass, getClassName()));

		if (Settings.shouldPatchPrivateChannelSidebarList()) updatePrivateChannelsNode();
	},

	stop() {
		$('#app-mount').attr('class', defaultAppMountClass);
		if (Settings.shouldPatchPrivateChannelSidebarList()) updatePrivateChannelsNode();
	},

	styles,
	Settings,
	SettingsPanel,
});