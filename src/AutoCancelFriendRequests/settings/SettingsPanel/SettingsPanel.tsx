import React from "@react";
import { Setting } from '@components';
import { GuildStore, SortedGuildStore } from "@discord/stores";
import { Settings, titles } from "../Settings";

export default function SettingsPanel() {
	const [settings, set] = Settings.useState();
	const folderNames = SortedGuildStore.getGuildFolders().map(folder => folder.folderName);
	const guildNames = SortedGuildStore.getFlattenedGuildIds().map(GuildStore.getGuild).map(guild => guild.name);

	const props = {
		settings,
		set,
		titles,
	};

	return (
		<div className="danho-plugin-settings">
			<Setting setting="folderIds" type='select' options={folderNames}
				beforeChange={folderNames => SortedGuildStore
					.getGuildFolders()
					.filter(folder => folderNames.includes(folder.folderName))
					.map(folder => folder.folderId)}
				{...props}
			/>
			{/* Guild Ids */}
			<Setting setting="guildIds" type="select" options={guildNames}
				beforeChange={guildNames => SortedGuildStore
					.getFlattenedGuildIds()
					.filter(guild => guildNames.includes(GuildStore.getGuild(guild).name))}
				{...props}
			/>
			<Setting setting="cancelNoMutuals" {...props} />
		</div>
	);
}