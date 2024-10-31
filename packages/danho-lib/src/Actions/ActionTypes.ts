import { VoiceStateUpdate } from "@stores";
import { Snowflake, GuildMember, Message, User, Activity, UserStatus } from "@discord/types";

type ActionProps = {
  CHANNEL_SELECT: {
    channelId: Snowflake;
    guildId: Snowflake;
    jumpType?: undefined;
    messageId?: Snowflake | null;
    preserveDrawerState: undefined;
    source?: undefined;
  };
  LOAD_FORUM_POSTS: {
    guildId: Snowflake;
    threads: {
      [threadId: Snowflake]: {
        first_message: Message;
        owner: GuildMember;
      };
    };
  };
  MESSAGE_CREATE: {
    channelId: Snowflake;
    guildId?: Snowflake;
    isPushNotification: boolean;
    message: Message;
    optimistic: boolean;
  };
  PRESENCE_UPDATES: {
    updates: Array<{
      activities: Array<Activity>;
      clientStatus: {
        desktop?: UserStatus;
        mobile?: UserStatus;
      };
      guildId?: Snowflake | undefined;
      status: UserStatus;
      user: User | { id: Snowflake; };
    }>;
  };
  RELATIONSHIP_ADD: {
    relationship: {
      id: Snowflake;
      type: number;
      nickname: null | string;
      since: string;
      isSpamRequest: boolean;
      user: User;
    },
    shouldNotify: boolean;
  }
  USER_PROFILE_MODAL_OPEN: {
    analyticsLocation?: undefined;
    channelId: Snowflake;
    friendToken?: undefined;
    guildId?: Snowflake | undefined;
    messageId: Snowflake;
    roleId?: Snowflake | undefined;
    sessionId: string;
    showGuildProfile: boolean;
    sourceAnalyticsLocations: Array<string>;
    subsection?: undefined;
    userId: Snowflake;
  };
  VOICE_STATE_UPDATES: {
    voiceStates: Array<VoiceStateUpdate>;
  };
};

export type Actions = {
  [Key in keyof ActionProps]: [
    action: ActionProps[Key] & { type: Key; }
  ]
};