import React, { Setting } from "@react";
import { Settings, titles } from "../Settings";
import { hexToRgb, rgbToHex } from "@danho-lib/Utils/Colors";

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
				formatValue={rgbString => "#" + rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
				beforeChange={hex => hexToRgb(hex).join(',')}
			/>
			<Setting setting="groupRoles" {...props} />
		</div>
	);
}