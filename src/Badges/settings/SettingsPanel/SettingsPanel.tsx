import React from "@react";
import { Setting, TabBar } from '@components';

import { Settings, titles } from "../Settings";

import CustomDiscordBadgesSettingsGroup from "./CustomDiscordBadgesSettingsGroup";
import CustomClientBadgesSettingsGroup from "./CustomClientBadgesSettings";

export default function SettingsPanel() {
	const [settings, set] = Settings.useState();
	const props = {
		settings,
		set,
		titles,
	};

	const shouldRenderTabBar = (
		settings.useDiscordCustomBadges
		|| settings.useClientCustomBadges
	);

	return (
		<div className="danho-plugin-settings">
			<Setting setting="movePremiumBadge" {...props} />
			<Setting setting="useDiscordCustomBadges" {...props} />
			<Setting setting="useClientCustomBadges" {...props} />
			{shouldRenderTabBar && (
				<TabBar tabs={[
					['useDiscordCustomBadges', 'Discord Custom Badges'],
					['useClientCustomBadges', 'Your Custom Badges'],
				]}
					useDiscordCustomBadges={<CustomDiscordBadgesSettingsGroup />}
					useClientCustomBadges={<CustomClientBadgesSettingsGroup />}
				/>
			)}
		</div>
	);
}