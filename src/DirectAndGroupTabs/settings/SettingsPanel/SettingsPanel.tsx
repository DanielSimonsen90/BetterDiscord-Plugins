import React from "@react";
import { Setting } from '@components';
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
			<Setting setting="defaultDirectAndGroupTab" {...props} type="select" options={['direct', 'group']} />
		</div>
	);
}