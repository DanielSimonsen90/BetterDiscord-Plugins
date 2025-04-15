import { SettingsStore } from "@dium/settings";

type Settings = {
	removePrivateSearchButton: boolean,
	groupPrivateChannelNavOptions: boolean,
	alignUserAreaPanelsAndChannelTextArea: boolean,
	roundGuildIcons: boolean,
	sharpenButtons: boolean,
	giveLastMessageMoreSpace: boolean,
}

export const Settings = new class UiReworkFixSettingsStore extends SettingsStore<Settings> {
	constructor() {
		super({
			removePrivateSearchButton: true,
			groupPrivateChannelNavOptions: true,
			alignUserAreaPanelsAndChannelTextArea: true,
			roundGuildIcons: true,
			sharpenButtons: true,
			giveLastMessageMoreSpace: true,
		});
	}
	
	public shouldPatchPrivateChannelSidebarList() {
		const { groupPrivateChannelNavOptions, removePrivateSearchButton } = this.current;
		return groupPrivateChannelNavOptions || removePrivateSearchButton;
	}
}

export const titles: Record<keyof Settings, string> = {
	alignUserAreaPanelsAndChannelTextArea: `Align UserArea panels to match height of channelTextArea`,
	removePrivateSearchButton: `Remove the search button in the private channel sidebar`,
	groupPrivateChannelNavOptions: `Group navigation options (friends, nitro, shop) in the private channel sidebar`,
	roundGuildIcons: `Round guild icons into circles`,
	sharpenButtons: `Square-up buttons`,
	giveLastMessageMoreSpace: `Give last message more space`,
}