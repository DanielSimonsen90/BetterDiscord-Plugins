import { Channel, Guild, Snowflake } from "@discord";
import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";

export interface GuildChannelStore extends Store {
    getAllGuilds(): Record<Snowflake, Guild>;
    getChannels(guildId: Snowflake): Record<'4' | 'SELECTABLE' | 'VOCAL', Array<StoredChannel>> & {
        count: number,
        id: Snowflake | "null"
    };
    getDefaultChannel(guildId: Snowflake): Channel;
    getSelectableChannelIds(guildId: Snowflake): Array<Snowflake>;
    getTextChannelNameDisambiguations(guildId: Snowflake): Record<Snowflake, { id: Snowflake, name: string }>; 
    getVocalChannelIds(guildId: Snowflake): Array<Snowflake>;
    hasCategories(guildId: Snowflake): boolean;
    hasChannels(guildId: Snowflake): boolean;
    hasElevatedPermissions(guildId: Snowflake): boolean;
    hasSelectableChannel(guildId: Snowflake, channelId: Snowflake): boolean;
}
export const GuildChannelStore: GuildChannelStore = Finder.byProps("getTextChannelNameDisambiguations");
export default GuildChannelStore;

type StoredChannel = {
    comparator: number,
    channel: Channel
}