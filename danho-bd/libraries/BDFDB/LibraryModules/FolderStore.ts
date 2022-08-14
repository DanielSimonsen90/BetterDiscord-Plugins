import { Store } from "@discordium/modules/flux";
import { GuildFolder, Snowflake } from '@discord'

export default interface FolderStore extends Store {
    get guildFolders(): Array<GuildFolder>;

    getCachedState(): {
        folders: Array<GuildFolder>;
        sortedGuilds: Array<SortedGuild>;
    }
    getFlattenedGuildIds(): Array<Snowflake>;
    getGuildFolderById(folderId: string): GuildFolder;
    getSortedGuilds(): Array<SortedGuild>;
}
export type SortedGuild = Omit<GuildFolder, 'guildIds'> &{
    index: number,
    guilds: Array<Snowflake>,
    muteConfig: undefined
}