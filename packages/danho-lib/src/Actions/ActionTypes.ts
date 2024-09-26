import { Snowflake } from "@discord/types/base";
import { GuildMember } from "@discord/types/guild/member";
import { Message } from "@discord/types/message";

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
};

export type Actions = {
  [Key in keyof ActionProps]: [
    action: ActionProps[Key] & { type: Key; }
  ]
};