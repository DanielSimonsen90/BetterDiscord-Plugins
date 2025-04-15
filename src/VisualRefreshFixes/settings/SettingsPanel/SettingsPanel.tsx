import React from "@react";
import { Setting } from "@components";
import { Settings, titles } from "../Settings";

export default function SettingsPanel() {
	const [settings, set] = Settings.useState();
	const props = {
		settings,
		set,
		titles,
	}
	
	return (
		<div className="danho-plugin-settings">
			<Setting setting="alignUserAreaPanelsAndChannelTextArea" {...props} /> 
			<Setting setting="removePrivateSearchButton" {...props} />
			<Setting setting="groupPrivateChannelNavOptions" {...props} />
			<Setting setting="roundGuildIcons" {...props} />
			<Setting setting="sharpenButtons" {...props} />
			<Setting setting="giveLastMessageMoreSpace" {...props} />
		</div>
	);
}