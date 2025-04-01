import Finder from "@danho-lib/dium/api/finder";
import { Channel, Guild, Snowflake } from "@discord/types";
import { VoiceChannelVoiceState } from "./VoiceChannel";

export type StageChannel = JSX.BD.FC<{
  channel: Channel;
  collapsed: boolean;
  connected: boolean;
  disableManageChannels: undefined;
  guild: Guild;
  isFavoriteCategory: boolean;
  position: number;
  selected: boolean;
  speakerVoiceStates: Array<VoiceChannelVoiceState>;
  voiceStates: Array<VoiceChannelVoiceState>
}, {
  bypassLimit: boolean;
  canManageChannel: boolean;
  canMoveMembers: boolean;
  canReorderChannel: boolean;
  categoryCollapsed: boolean;
  channel: Channel;
  channelInfo: null;
  collapsed: boolean;
  connectAction: 1;
  connected: boolean;
  disableManageChannels: undefined;
  forceShowButtons: boolean;
  guild: Guild;
  hasActiveEvent: boolean;
  isFavoriteCategory: boolean;
  isFavoriteSuggestion: boolean;
  isSubscriptionGated: boolean;
  locked: boolean;
  mentionCount: number;
  needSubscriptionToAccess: boolean;
  numAudience: number;
  position: number;
  resolvedUnreadSetting: number;
  selected: boolean;
  speakerVoiceStates: Array<VoiceChannelVoiceState>;
  stageInstance: undefined | StageInstance;
  unread: boolean;
  voiceStates: Array<VoiceChannelVoiceState>
}>

export const StageChannel: Record<'Z', StageChannel> = Finder.findBySourceStrings("channel", "voiceStates", "bypassLimit", "stageInstance", { defaultExport: false });
export default StageChannel;

export type StageInstance = {
  channel_id: Snowflake;
  discoverable_disabled: boolean;
  guild_id: Snowflake;
  guild_scheduled_event_id: undefined;
  id: Snowflake;
  invite_code: null | string;
  privacy_level: number;
  topic: string;
}