import React, { Setting } from "@react";
import { Settings, titles } from "../Settings";
import { DiscordTimeFormat } from "@discord/types";
import TimestampComponent from "@discord/components/Timestamp";
export default function SettingsPanel() {
	const [settings, set] = Settings.useState();
	const { timestampStyle } = Settings.useSelector(s => ({
		timestampStyle: s.birthdateTimestampStyle as DiscordTimeFormat
	}));
	const props = {
		settings,
		set,
		titles,
	};

	return (
		<div className="danho-plugin-settings">
			<Setting setting="hideBirthdateIcon" {...props} />
			<Setting setting="hideBirthdateTimestamp" {...props} />
			<Setting setting="birthdateTimestampStyle" {...props} type="select" options={[
				"D", "d",
				"T", "t",
				"F", "f",
				"R"
			] as Array<DiscordTimeFormat>} />
			<TimestampComponent format={timestampStyle} unix={Date.now() / 1000} />
		</div>
	);
}