import Finder from "../../finder";
import { VoiceState } from "@discord/stores";
import { ActivityIndexes, Channel, Guild, GuildMember, User } from "@discord/types";

export type VoiceChannel = JSX.BD.FC<{
  channel: Channel;
  collapsed: boolean;
  connected: boolean;
  disableManageChannels: undefined;
  guild: Guild;
  isFavoriteCategory: boolean;
  position: number;
  selected: boolean;
  showTutorial: boolean;
  subtitle: null;
  voiceStates: Array<VoiceChannelVoiceState>
  withGuildIcon: undefined;
}, {
  bypassLimit: boolean;
  canManageChannel: boolean;
  canMoveMembers: boolean;
  canReorderChannel: boolean;
  canShowThreadPreviewForUser: boolean;
  channel: Channel;
  channelInfo: null;
  channelName: string;
  collapsed: boolean;
  connected: boolean;
  disableManageChannels: undefined;
  embeddedActivityType: ActivityIndexes.PLAYING;
  embeddedApps: [];
  forceShowButtons: boolean;
  guild: Guild;
  hasActiveEvent: boolean;
  isFavoriteCategory: boolean;
  isFavoriteSuggestion: boolean;
  isSubscriptionGated: boolean;
  locked: boolean;
  mentionCount: number;
  needSubscriptionToAccess: boolean;
  position: number;
  resolvedUnreadSetting: number;
  selected: boolean;
  showTutorial: boolean;
  subtitle: null;
  unread: boolean;
  unverifiedAccount: boolean;
  video: boolean;
  voiceStates: Array<VoiceChannelVoiceState>
  withGuildIcon: undefined;
}>

export const VoiceChannel = Finder.bySourceStrings<VoiceChannel, true>("channel", "voiceStates", "bypassLimit", "hasVideo", { module: true });
export default VoiceChannel;

export type VoiceChannelVoiceState = {
  comparator: string;
  connectedOn: number;
  member: GuildMember;
  nick: string | null;
  user: User;
  voiceState: VoiceState;
}