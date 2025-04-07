import React, { Setting } from "@react";
import { Settings, titles } from "../Settings";
import CustomBadgesSettingsGroup from "./BadgesSettings";

export default function SettingsPanel() {
	const [settings, set] = Settings.useState();
	const props = {
		settings,
		set,
		titles,
	}
	
	return (
		<div className="danho-plugin-settings">
			<Setting setting="movePremiumBadge" {...props} />
			<Setting setting="useClientCustomBadges" {...props} />
			{settings.useClientCustomBadges && <CustomBadgesSettingsGroup />}
		</div>
	);
}