import { MutualFriend, MutualGuild, VoiceStateUpdate } from "@stores";
import { Snowflake, GuildMember, Message, User, Activity, UserStatus, ConnectedAccount, DisplayProfile, Role } from "@discord/types";
import { UserProfileBadge } from "@discord/components";
import { SpeakingFlags } from "@discord/types/channel/types";

type ActionProps = {
  CHANNEL_SELECT: {
    channelId: Snowflake;
    guildId: Snowflake;
    jumpType?: undefined;
    messageId?: Snowflake | null;
    preserveDrawerState?: undefined;
    source?: undefined;
  };
  GUILD_ROLE_UPDATE: {
    guildId: Snowflake;
    role: Role;
  },
  LOAD_FORUM_POSTS: {
    guildId: Snowflake;
    threads: {
      [threadId: Snowflake]: {
        first_message: Message;
        owner: GuildMember;
      };
    };
  };
  MESSAGE_ACK: {
    channelId: Snowflake;
    manual: undefined | boolean;
    messageId: Snowflake;
    newMentionCount: undefined | number;
    version: number;
  },
  MESSAGE_ACKED: {},
  MESSAGE_CREATE: {
    channelId: Snowflake;
    guildId?: Snowflake;
    isPushNotification: boolean;
    message: Message;
    optimistic: boolean;
  };
  QUICKSWITCHER_SEARCH: {
    query: string;
    queryNode: null;
  };
  QUERYSWITCHER_SELECT: {
    selectedIndex: number;
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
  };
  SPEAKING: {
    context: 'default';
    userId: Snowflake;
    speakingFlags: SpeakingFlags
  };
  USER_NOTE_LOAD_START: {
    userId: Snowflake;
  },
  USER_NOTE_LOADED: {
    userId: Snowflake;
    note?: {
      note: string;
      note_user_id: Snowflake;
      user_id: Snowflake;
    };
  },
  USER_PROFILE_FETCH_SUCCESS: {
    badges: Array<UserProfileBadge>;
    connected_accounts: Array<ConnectedAccount>
    guild_badges: [];
    legacy_username: string | undefined;
    mutual_friends: Array<MutualFriend>;
    mutual_guilds: Array<MutualGuild>;
    premium_guild_since: null | string;
    premium_since: null | string;
    premium_type: number;
    profile_themes_experiment_bucket: number;
    user: User;
    user_profile: Pick<DisplayProfile, 'banner' | 'bio' | 'pronouns'> & {
      accent_color: DisplayProfile['accentColor']
      emoji: null;
      popout_animation_particle_type: DisplayProfile['popoutAnimationparticleType'];
      profile_effect: null | {
        expires_at: DisplayProfile['profileEffectExpiresAt'];
        id: DisplayProfile['profileEffectId'];
      };
      theme_colors: DisplayProfile['themeColors'];
    }
  };
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
  VOICE_CHANNEL_SELECT: {
    channelId: Snowflake;
    currentVoiceChannelId: Snowflake;
    guildId: Snowflake;
    stream: boolean;
    video: boolean;
  }
};

export type Actions = {
  [Key in keyof ActionProps]: [
    // action: ActionProps[Key] & { type: Key; }
    action: ActionProps[Key]
  ]
};