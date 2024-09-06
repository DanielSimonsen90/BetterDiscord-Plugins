import type { Snowflake } from "@discord/types/base";

import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface VoiceStore extends Store {
    get userHasBeenMovedVersion(): number

    getAllVoiceStates(): {
        [guildId: Snowflake]: {
            [userId: Snowflake]: VoiceState
        }
    };
    getCurrentClientVoiceChannelId(guildId: Snowflake): Snowflake;
    getUserVoiceChannelId(guildId: Snowflake, userId: Snowflake): Snowflake;
    getVideoVoiceStatesForChannel(channelId: Snowflake): GuildVoiceState | {};
    getVoiceState(guildId: Snowflake, userId: Snowflake): GuildVoiceState;
    getVoiceStateForChannel(channelId: Snowflake, userId?: Snowflake): GuildVoiceState;
    getVoiceStateForSession(userId: Snowflake, sessionId?: string): VoiceState;
    getVoiceStateForUser(userId: Snowflake): VoiceState;
    /** @default me */
    getVoiceStates(guildId?: Snowflake): GuildVoiceState;
    getVoiceStatesForChannel(channelId: Snowflake): GuildVoiceState;
    hasVideo(channelId: Snowflake): boolean;
    isCurrentClientInVoiceChannel(): boolean;
    isInChannel(channelId: Snowflake, userId?: Snowflake): boolean;
}
export const VoiceStore = Finder.byKeys(["getVoiceStateForUser"]);
export default VoiceStore;

export type VoiceState = {
    channelId: Snowflake;
    deaf: boolean;
    mute: boolean;
    requestTospeakTimestamp: null | number;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionId: string;
    suppress: boolean;
    userId: Snowflake;

    isVoiceDeafened(): boolean;
    isVoiceMuted(): boolean;
}
export type GuildVoiceState = {
    [userId: Snowflake]: VoiceState
}

// h: Guild
// m: Channel
// T: User
// v: VoiceState
// l: Constants
// I: Record<ChannelId, VideoVoiceState>