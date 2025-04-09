import { createPlugin } from "@dium";
import { ActionsEmitter } from '@actions';
import { ChannelUtils } from "@danho-lib/Utils";

import subscribeToActions from "./actions";
import patch from "./patches";
import { Settings, SettingsPanel } from './settings';
import loadStores, { LockedChannelsStore } from "./stores";
import styles from './style.scss';

export default createPlugin({
	start() {
		patch();
		subscribeToActions();
		loadStores();

		if (LockedChannelsStore.isLocked(ChannelUtils.currentChannelId)) {
			ActionsEmitter.emit('LOCK_CHANNEL', { channelId: ChannelUtils.currentChannelId });
		}
	},
	
	stop() {
		ActionsEmitter.removeAllListeners();
	},
  
	styles,
	Settings,
	SettingsPanel,
});