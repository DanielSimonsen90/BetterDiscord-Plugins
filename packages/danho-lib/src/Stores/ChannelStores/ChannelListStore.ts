import { GuildMember, User, ActivityTypes, Snowflake, UserStatus, Channel } from "@discord/types";
import { Finder } from "@dium/api";
import { Guild } from "@dium/modules";
import { Store } from "@dium/modules/flux";

export interface ChannelListStore extends Store {
  getGuild(guildId: Snowflake, guildFeatures?: Array<string>): ChannelListStoreResult;
  getGuildWithoutChangingGuildActionRows(guildId: Snowflake): ChannelListStoreResult;
  recentsChannelCount(guildId?: Snowflake): number;
}
export const ChannelListStore: ChannelListStore = Finder.byName('ChannelListStore');
export default ChannelListStore;

type ChannelListStoreResult = {
  guildChannelsVersion: number;
  guildChannels: GuildChannelCollection;
}
export type GuildChannelCollection = {
  allChannelsById: null | {
    [channelId: Snowflake]: ChannelRecord
  }
  categories: {
    [categoryChannelId: Snowflake]: CategoryRecord
  }
  channelNoticeSection: Record<'rows', Array<any>>;
  collapsedCategoryIds: {
    [categoryChannelId: Snowflake]: boolean
  }
  favoriteChannelIds: Set<Snowflake>;
  favoritesCategory: CategoryRecordExtended;
  favoritesSectionNumber: number;
  firstVoiceChannel: undefined;
  guildActionSection: Record<'guildActionRows', Array<any>>;
  hideMutedChannels: boolean;
  hideResourceChannels: boolean;
  id: Snowflake;
  mutedChannelIds: Set<Snowflake>;
  noParentCategory: CategoryRecordExtended;
  optInEnabled: boolean;
  optedInChannels: Set<Snowflake>;
  recentsCategory: CategoryRecordExtended;
  recentsSectionNumber: number;
  rows: Array<string | Snowflake>;
  sections: Array<0 | 1 | 5 |15>;
  sortedNamedCategories: null | Array<CategoryRecordExtended>;
  suggestedFavoriteChannelId: Snowflake | null;
  version: number;
  voiceChannelsCategory: CategoryRecordExtended & {
    categoriesById: {
      [categoryChannelId: Snowflake]: Channel;
    }
  }
  voiceChannelsSectionNumber: number;
  
  get initializationData(): {
    activeJoinedRelevantThreads: {
      [channelId: Snowflake]: {
        [threadChannelId: Snowflake]: {
          channel: Channel;
          joinTimestamp: number;
        }
      }
    }
    activeJoinedUnreadThreads: {};
    selectedChannel: Channel;
    selectedVoiceChannelId: Snowflake;
  }

  getSections(): Array<0 | 1 | 5 | 15>;
  getChannelFromSectionRow(section: number, row: number): null | {
    channel: Channel;
    category: CategoryRecord
  }
  isPlaceholderRow(section: number, row: number): boolean;
};

export type CategoryRecordExtended = {
  channels: {
    [channelId: Snowflake]: ChannelRecord
  }
  guild: Guild;
  isCollapsed: boolean;
  isMuted: boolean;
  position: number;
  shownChannelIds: Array<Snowflake> | null;
}
export type CategoryRecord = {
  channels: {
    [channelId: Snowflake]: ChannelRecord
  }
}
export type ChannelRecord = {
  category: CategoryRecord;
  id: Snowflake;
  position: number;
  record: Channel;
  renderLevel: number;
  subtitle: null;
  threadCount: number;
  threadIds: Array<Snowflake>;

  get isCollapsed(): boolean;
  get isFirstVoiceChannel(): boolean;
  get isMuted(): boolean;
  get lastMessageTimestamp(): number;

  computeState(props: ChannelListStoreProps): {
    renderLevel: number;
    threadIds: Array<Snowflake>;
  };
  computeSubtitle(): string | null;
  updateChannel(channel: Channel, props: ChannelListStoreProps): boolean;
  updateSubtitle(): string | null;
};

type ChannelListStoreProps = {
  selectedChannel: Channel;
  selectedVoiceChannelId: Snowflake;
  activeJoinedRelevantThreads: Array<Snowflake>;
  activeJoinedUnreadThreads: Array<Snowflake>;
}