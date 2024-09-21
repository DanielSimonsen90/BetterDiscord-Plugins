import { Snowflake } from "@dium/modules";
import type { User } from "../user";

export type GuildMember = Pick<User, 'avatar' | 'flags'> & {
  avatarDecoration: undefined,
  colorRoleId: Snowflake,
  colorString: string,
  communicatinDisabledUntil: null,
  fullProfileLoadedTimestamp: number,
  guildId: Snowflake,
  highestRoleId: Snowflake;
  hoistRoleId: Snowflake;
  iconRoleId: Snowflake | undefined,
  isPending: boolean,
  joinedAt: string,
  nick: string | null,
  premiumSince: string | null,
  roles: Array<Snowflake>,
  unusualDMActivityUntil: null,
  userId: Snowflake,
};