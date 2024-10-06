import { Snowflake } from "@discord/types/base";
import { GuildMember } from "@discord/types/guild/member";
import { Message } from "@discord/types/message";
import { User } from "@discord/types/user";
import { Activity } from "@discord/types/user/activity";
import { UserStatus } from "@discord/types/user/status";

type ActionProps = {
  CHANNEL_SELECT: {
    channelId: Snowflake;
    guildId: Snowflake;
    jumpType: undefined;
    messageId: Snowflake | null;
    preserveDrawerState: undefined;
    source: undefined;
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
  PRESENCE_UPDATES: {
    updates: Array<{
      activities: Array<Activity>;
      clientStatus: {
        desktop?: UserStatus;
        mobile?: UserStatus;
      };
      guildId: Snowflake | undefined;
      status: UserStatus;
      user: User | { id: Snowflake; };
    }>
  }
};

export type Actions = {
  [Key in keyof ActionProps]: [
    action: ActionProps[Key] & { type: Key; }
  ]
};