import { Snowflake } from "../base";
import { PermissionOverwrite } from "../guild";
import { ChannelTypes } from "./types";

export * from './types';

export interface Channel {
  parent_id: Snowflake;
  id: Snowflake;
  name: string;
  type: ChannelTypes;
  topic: string;

  bitrate: number;
  defaultAutoArchiveDuration?: any;
  icon?: any;
  guild_id: Snowflake;
  userLimit: number;

  member?: any;
  memberCount?: any;
  memberIdsPreview?: any;
  memberListId?: any;
  messageCount?: any;

  nicks: Record<any, any>;
  nsfw: boolean;

  originChannelId?: Snowflake;
  ownerId?: Snowflake;

  permissionOverwrites: Record<Snowflake, PermissionOverwrite>;

  position: number;
  lastMessageId: Snowflake;
  lastPinTimestamp: string;
  rateLimitPerUser: number;
  rawRecipients: any[];
  recipients: any[];
  rtcRegion?: any;
  threadMetadata?: any;
  videoQualityMode?: any;

  accessPermission: any;
  lastActiveTimestamp: any;
  viewPermission: any;

  computeLurkerPermissionsAllowList(): any;
  getApplicationId(): any;
  getGuildId(): Snowflake;
  getRecipientId(): any;

  isActiveThread(): boolean;
  isArchivedThread(): boolean;
  isCategory(): boolean;
  isDM(): boolean;
  isDirectory(): boolean;
  isGroupDM(): boolean;
  isGuildStageVoice(): boolean;
  isGuildVoice(): boolean;
  isListenModeCapable(): boolean;
  isManaged(): boolean;
  isMultiUserDM(): boolean;
  isNSFW(): boolean;
  isOwner(memberId: Snowflake): boolean;
  isPrivate(): boolean;
  isSubscriptionGatedInGuild(arg: any): boolean;
  isSystemDM(): boolean;
  isThread(): boolean;
  isVocal(): boolean;
}

export interface SortedChannel {
  application_id: undefined;
  appliedTags: undefined;
  availableTags: undefined | Array<unknown>;
  bitrate_: undefined;
  blockedUserWarningDismissed: undefined;
  channelType: ChannelTypes;
  defaultAutoArchiveDuration: undefined;
  defaultForumLayout: undefined;
  defaultReactionEmoji: undefined;
  defaultSortOrder: undefined;
  defaultThreadRateLimitPerUser: undefined;
  flags_: undefined | number;
  guild_id: undefined | Snowflake;
  hdStreamingBuyerId: undefined;
  hdStreamingUntil: undefined;
  icon: undefined;
  iconEmoji: undefined;
  id: 'null' | Snowflake;
  isMessageRequest: undefined;
  isMessageRequestTimestamp: undefined;
  isSpam: undefined;
  lastMessageId: undefined | Snowflake;
  lastPinTimestamp: undefined;
  linkedLobby: undefined;
  member: undefined;
  memberCount: undefined;
  memberIdsPreview: undefined;
  memberListId: undefined;
  messageCount: undefined;
  name: 'Uncategorized' | string;
  nicks: undefined;
  nsfw_: undefined | boolean;
  originalChannelId: undefined;
  ownerId: undefined;
  parentChannelThreadtype: undefined;
  parent_id: undefined;
  permissionOverwrites_: {} | Record<Snowflake, PermissionOverwrite>
  position_: undefined | number;
  rateLimitPerUser_: undefined | number;
  rawRecipients: undefined;
  recipientFlags: undefined;
  recipients: undefined;
  rtcRegion: undefined;
  safetyWarnings: undefined;
  template: undefined;
  themeColor: undefined;
  threadMetadata: undefined;
  topic_: undefined;
  totalMessageSent: undefined;
  type: ChannelTypes;
  userLimit_: undefined;
  version: undefined;
  videoQualityMode: undefined;
  wallpaper: undefined;
}