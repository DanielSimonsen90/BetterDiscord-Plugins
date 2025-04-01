import type { Snowflake } from "@discord/types/base";

import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface VoiceStore extends Store {
  get userHasBeenMovedVersion(): number;

  getAllVoiceStates(): {
    [guildId: Snowflake]: GuildVoiceState;
  };
  getCurrentClientVoiceChannelId(guildId: Snowflake): Snowflake;
  getUserVoiceChannelId(guildId: Snowflake, userId: Snowflake): Snowflake;
  getVideoVoiceStatesForChannel(channelId: Snowflake): GuildVoiceState | {};
  getVoiceState(guildId: Snowflake, userId: Snowflake): GuildVoiceState;
  getVoiceStateForChannel(channelId: Snowflake, userId?: Snowflake): GuildVoiceState | undefined;
  getVoiceStateForSession(userId: Snowflake, sessionId?: string): VoiceState;
  getVoiceStateForUser(userId: Snowflake): VoiceState | undefined;
  /** @default me */
  getVoiceStates(guildId?: Snowflake): GuildVoiceState;
  getVoiceStatesForChannel(channelId: Snowflake): GuildVoiceState;
  hasVideo(channelId: Snowflake): boolean;
  isCurrentClientInVoiceChannel(): boolean;
  isInChannel(channelId: Snowflake, userId?: Snowflake): boolean;
}

interface VoiceStoreExtension extends VoiceStore {
  getVoiceStateArrayForChannel(channelId: Snowflake): VoiceState[];
}

export const VoiceStore: VoiceStoreExtension = Finder.byKeys(["getVoiceStateForUser"]);
export default VoiceStore;

VoiceStore.getVoiceStateArrayForChannel = (function (this: VoiceStore, channelId: Snowflake) {
  const voiceStates = this.getVoiceStatesForChannel(channelId);
  return Object.values(voiceStates);
}).bind(VoiceStore);

export type VoiceState = {
  channelId: Snowflake;
  deaf: boolean;
  discoverable: boolean;
  mute: boolean;
  requestTospeakTimestamp?: null | number;
  selfDeaf: boolean;
  selfMute: boolean;
  selfStream: boolean;
  selfVideo: boolean;
  sessionId: string;
  suppress: boolean;
  userId: Snowflake;

  get isVoiceDeafened(): boolean;
  get isVoiceMuted(): boolean;
};
export type GuildVoiceState = {
  [userId: Snowflake]: VoiceState;
};

export type VoiceStateUpdate = Pick<VoiceState,
  | 'channelId' | 'deaf' | 'discoverable' | 'mute'
  | 'requestTospeakTimestamp' | 'selfDeaf' | 'selfMute'
  | 'selfStream' | 'selfVideo'
  | 'sessionId' | 'suppress' | 'userId'
> & {
  guildId: Snowflake;
  oldChannelId: Snowflake;
};

// h: Guild
// m: Channel
// T: User
// v: VoiceState
// l: Constants
// I: Record<ChannelId, VideoVoiceState>