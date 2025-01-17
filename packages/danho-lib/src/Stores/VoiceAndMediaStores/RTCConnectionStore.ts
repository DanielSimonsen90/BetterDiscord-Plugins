import type { Snowflake, Emoji as BaseEmoji, Channel } from "@discord/types";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface RTCConnectionStore extends Store {
  getAveragePing(): number;
  getChannelId(): Snowflake;
  getDuration(): number;
  getHostname(): string;
  getLastPing(): number;
  getLastSessionVoiceChannelId(): Snowflake;
  getMediaSessionId(): string;
  getOutboundLossRate(): number;
  getPacketStats(): PacketStats;
  getPings(): Array<{
    time: number;
    value: number;
  }>
  getQuality(): Quality;
  getRTCConnection: (() => RTCConnection) | undefined;
  getRTCConnectionId(): string;
  getRemoteDisconnectedVoiceChannelId(): Snowflake;
  getSecureFramesRosterMapEntry(e: any): any;
  getSecureFramesState(): SecureFramesState;
  getState(): State;
  getUserIds(): Set<Snowflake>;
  getVoiceStateStats(): VoiteStateStats;
  getWasEverMultiParticipant(): boolean;
  getWasEverRtcConnected(): boolean;
  isConnected(): boolean;
  isDisconnected(): boolean;
  isUserConnected(userId: Snowflake): boolean;
}

export const RTCConnectionStore: RTCConnectionStore = Finder.byName("RTCConnectionStore");

type State = 'RTC_CONNECTED' | 'AWAITING_ENDPOINT' | 'CONNECTING' | 'AUTHENTICATED' | 'RTC_CONNECTING';
type PacketStats = (
  & Record<`fec_packets_${'discarded' | 'recieved'}`, number>
  & Record<`packets_${'sent' | 'received'}${'' | '_lost'}`, number>
)
type SecureFramesState = {
  epochAuthenticator: string;
  version: number;
}
type VoiteStateStats = Record<
  `${'max' | 'total'}_${'listener' | 'speaker' | 'voice_state'}_count`, 
  number
>

type Quality = (string | {}) & 'fine'

type RTCConnection = {
  // There is A LOT of other properties on this type, but these are the "discord important" ones
  channelIds: Set<Snowflake>;
  getAudioDeviceStates(): any;
  getVideoDeviceStates(): any;
  guildId: Snowflake;
  hostname: string;
  logger: Pick<Console, 'error' | 'log' | 'warn' | 'info' | 'time' | 'trace'>;
  reconnect(): any;
  state: State;
  stateHistory: Array<{
    state: State;
    startTime: number;
  }>
  userId: Snowflake;

  get channelId(): Snowflake;
  get endpoint(): string;
  get quality(): Quality;
}