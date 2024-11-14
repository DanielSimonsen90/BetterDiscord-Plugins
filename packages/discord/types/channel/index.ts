import { Snowflake } from "../base";
import { PermissionOverwrite } from "../guild";
import { ChannelTypes } from "./types";
// import { Channel } from "@dium/modules";

export interface Channel {
  id: Snowflake;
  name: string;
  type: ChannelTypes;
  topic: string;

  bitrate: number;
  defaultAutoArchiveDuration?: any;
  icon?: any;
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