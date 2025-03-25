// import { Channel, Guild, Snowflake } from "../Discord";
import { SortableArray } from '@danho-lib/Utils/Array';
import type { Channel, Guild, Snowflake } from '@discord/types';
import { ChannelTypes } from '@discord/types/channel/types';
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface GuildChannelStore extends Store {
  getAllGuilds(): Record<Snowflake, Guild>;
  getChannels(guildId: Snowflake): Record<'4' | 'SELECTABLE' | 'VOCAL', Array<StoredChannel>> & {
    count: number,
    id: Snowflake | "null";
  };
  getDefaultChannel(guildId: Snowflake): Channel;
  getSelectableChannelIds(guildId: Snowflake): Array<Snowflake>;
  getTextChannelNameDisambiguations(guildId: Snowflake): Record<Snowflake, { id: Snowflake, name: string; }>;
  getVocalChannelIds(guildId: Snowflake): Array<Snowflake>;
  hasCategories(guildId: Snowflake): boolean;
  hasChannels(guildId: Snowflake): boolean;
  hasElevatedPermissions(guildId: Snowflake): boolean;
  hasSelectableChannel(guildId: Snowflake, channelId: Snowflake): boolean;
}

export interface ExtendedGuildChannelStore extends GuildChannelStore {
  getSortedChannels(guildId: Snowflake): Array<Channel>;
}

export const GuildChannelStore: GuildChannelStore = Finder.byKeys(["getTextChannelNameDisambiguations"]);
export default GuildChannelStore;

type StoredChannel = {
  comparator: number,
  channel: Channel;
};

GuildChannelStore.constructor.prototype.getSortedChannels = function getSortedChannels(this: GuildChannelStore, guildId: Snowflake): Array<Channel> {
  const getChannelsResult = this.getChannels(guildId);
  delete getChannelsResult.count;
  delete getChannelsResult.id;
  
  const channels = Object
    .values<Array<StoredChannel>>(getChannelsResult as any)
    .flat()
    .filter((entry, index, array) => array.findIndex(bEntry => bEntry.channel.id === entry.channel.id) === index)
    .map(entry => Object.assign({ channelType: entry.channel.type }, entry.channel));

  const categories = channels.filter(channel => channel.type === ChannelTypes.GuildCategory);
  return categories.flatMap(category => [category, ...channels
    .filter(channel => channel.parent_id === category.id)
    .sort((a, b) => a.position - b.position)
  ]);
};