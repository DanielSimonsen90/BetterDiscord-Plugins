import { Finder } from "@dium";
import { Store } from "@dium/modules/flux";
import { DisplayProfile, Guild, Snowflake, User, UserStatus } from '@discord/types'

export type UserProfileStore = Store & {
  getGuildMemberProfile(userId: Snowflake, guildId: Snowflake): DisplayProfile;
  getMutualFriends(userId: Snowflake): Array<{
    key: Snowflake;
    status: UserStatus;
    user: User;
  }>;
  getMutualFriendsCount(userId: Snowflake): number;
  getMutualGuilds(userId: Snowflake): Array<{
    nick: string | null;
    guild: Guild;
  }>;
  getUserProfile(userId: Snowflake): DisplayProfile & { badges: Array<any> };
  isFetchingFriends(userId: Snowflake): boolean;
  isFetchingProfile(userId: Snowflake): boolean;
  get isSubmitting(): boolean;
};

export const UserProfileStore: UserProfileStore = Finder.byName("UserProfileStore");