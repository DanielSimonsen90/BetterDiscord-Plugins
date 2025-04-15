import { Snowflake } from "@discord/types/base";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface UserGuildSettingsStore extends Omit<Store, 'initialize'> {
  get accountNotificationSettings(): {
    flags: number;
  }
  allowAllMessages(props: Props): boolean;
  allowNoMessages(props: Props): boolean;
  getAddedToMessages(): Set<unknown>;
  getAllSettings(): Settings;
  getChannelFlags(props: Props): number;
  getChannelIdFlags(guildId: Snowflake, channelId: Snowflake): number;
  getChannelMessageNotifications(guildId: Snowflake, channelId: Snowflake): number;
  getChannelMuteConfig(guildId: Snowflake, channelId: Snowflake): MuteConfig | null;
  getChannelOverrides(guildId: Snowflake): {
    [channelId: Snowflake]: ChannelOverride;
  }
  getChannelRecordUnreadSetting(props: Props): number;
  getChannelUnreadSetting(guildId: Snowflake, channelId: Snowflake): number;
  getGuildFavorites(guildId: Snowflake): Array<Snowflake>
  getGuildFlags(guildId: Snowflake): number;
  getGuildUnreadSetting(guildId: Snowflake): number;
  getMessageNotifications(guildId: Snowflake): number;
  getMuteConfig(guildId: Snowflake): null;
  getMutedChannels(guildId: Snowflake): Set<Snowflake>;
  getNewForumThreadsCreated(props: Props): boolean;
  getNotifyHighlights(guildId: Snowflake): boolean;
  getOptedInChannels(guildId: Snowflake): Set<Snowflake>;
  getOptedInChannelsWithPendingUpdates(guildId: Snowflake): undefined;
  getPendingChannelUpdates(guildId: Snowflake): undefined;
  getState(): State;
  initialize(e: any): void;
  isAddedToMessages(channelId: Snowflake): boolean;
  isCategoryMuted(guildId: Snowflake, channelId: Snowflake): boolean;
  isChannelMuted(guildId: Snowflake, channelId: Snowflake): boolean;
  isChannelOptedIn(channelId: Snowflake, t: Snowflake, n?: any): boolean;
  isChannelOrParentOptedIn(_: unknown, channelId: Snowflake, n: any): boolean;
  isChannelRecordOrParentOptedIn(props: PropsWithParent, t: any): boolean;
  isFavorite(guildId: Snowflake, channelId: Snowflake): boolean;
  isGuildCollapsed(guildId: Snowflake): boolean;
  isGuildOrCategoryOrChannelMuted(guildId: Snowflake, channelId: Snowflake): boolean;
  isMessagesFavorite(channelId: Snowflake): boolean;
  isMobilePushEnabled(guildId: Snowflake): boolean;
  isMuteScheduledEventsEnabled(guildId: Snowflake): boolean;
  isMuted(guildId: Snowflake): boolean;
  isOptInEnabled(guildId: Snowflake): boolean;
  isSuppressEveryoneEnabled(guildId: Snowflake): boolean;
  isSuppressRolesEnabled(guildId: Snowflake): boolean;
  isTemporarilyMuted(guildId: Snowflake): boolean;
  get mentionOnAllMessages(): boolean;
  resolveGuildUnreadSetting(guildId: Snowflake): number;
  resolveUnreadSetting(props: PropsWithType): number;
  resolvedMessageNotifications(props: PropsWithParent): number;
  get useNewNotifications(): boolean;
}

export const UserGuildSettingsStore = Finder.byName<UserGuildSettingsStore>("UserGuildSettingsStore");
export default UserGuildSettingsStore;

type Props = {
  guild_id: Snowflake;
  id: Snowflake;
}
type PropsWithParent = Props & {
  parent_id: Snowflake;
}
type PropsWithType = Props & {
  type: any;
}

type Settings = {
  userGuildSettings: UserGuildSettingsStore;
  mutedChannels: any;
  optedinchannelsByGuild: any;
}

type State = {
  useNewNotifications: boolean;
}

type ChannelOverride = {
  channel_id: Snowflake;
  collapsed: boolean;
  messsage_notifications: number;
  mute_config: MuteConfig;
  muted: boolean;
}

type MuteConfig = {
  end_time: null;
  selected_time_window: number | -1;
}