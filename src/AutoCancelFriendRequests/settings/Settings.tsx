import { Snowflake } from "@discord/types";
import { SettingsStore } from "@dium/settings";
import { SortedGuildStore } from "@stores";

type Settings = {
	folderIds: Array<number>,
	guildIds: Array<Snowflake>,
	cancelNoMutuals: boolean,
}

export const Settings = new class AutoCancelFriendRequestsSettings extends SettingsStore<Settings> {
	constructor() {
		super({
			folderIds: new Array<number>(),
			guildIds: new Array<Snowflake>(),
			cancelNoMutuals: false,
		})
	}

	public isBlocked(folderId: number): boolean;
	public isBlocked(guildId: Snowflake): boolean;
	public isBlocked(arg: number | Snowflake): boolean {
		const folders = this.getBlockedFolders();
		const guildId = typeof arg === 'string' ? arg : undefined;
		const folderId = typeof arg === 'number' ? arg : undefined;

		return typeof arg === 'string' 
			? folders.some(folder => folder.guildIds.includes(guildId))
			|| this.current.guildIds.includes(guildId)
			: folders.some(folder => folder.folderId === folderId)
	}
	public getBlockedFolders() {
		return SortedGuildStore
			.getGuildFolders()
			.filter(folder => this.current.folderIds.includes(folder.folderId))
	}
	
}

export const titles: Record<keyof typeof Settings.current, string> = {
	folderIds: `Folders that should block all incoming friend requests`,
	guildIds: `Servers that should block all incoming friend requests (that aren't in a blocked folder)`,
	cancelNoMutuals: `Cancel friend requests from users without mutual servers or mutual friends`,
}