import React from "@react";
import { Setting } from '@components'
import { ColorUtils } from "@utils/Colors";
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
			<Setting setting="defaultRoleColor" type="color" {...props}
				formatValue={rgbString => "#" + ColorUtils.rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
				beforeChange={hex => ColorUtils.hexToRgb(hex).join(',')}
			/>
			<Setting setting="groupRoles" {...props} />
		</div>
	);
}