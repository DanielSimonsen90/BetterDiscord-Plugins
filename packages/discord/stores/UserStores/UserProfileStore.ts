import { DisplayProfile, Guild, Snowflake, User, UserStatus } from '@discord/types'
import { UserProfileBadge } from "@discord/components";
import { Store } from "@dium/modules/flux";
import { Finder } from "@injections";

export type UserProfileStore = Store & {
  getGuildMemberProfile(userId: Snowflake, guildId: Snowflake): DisplayProfile;
  getMutualFriends(userId: Snowflake): Array<{
    key: Snowflake;
    status: UserStatus;
    user: User;
  }>;
  getMutualFriendsCount(userId: Snowflake): number;
  getMutualGuilds(userId: Snowflake): undefined | Array<{
    nick: string | null;
    guild: Guild;
  }>;
  getUserProfile(userId: Snowflake): (DisplayProfile & { badges: Array<UserProfileBadge> }) | undefined;
  isFetchingFriends(userId: Snowflake): boolean;
  isFetchingProfile(userId: Snowflake): boolean;
  get isSubmitting(): boolean;
};

export const UserProfileStore = Finder.byName<UserProfileStore>("UserProfileStore");

/**
 * This type is only used for successful fetch action
 */
export type MutualFriend = {
  avatar: string;
  avatar_decoration_data: null | {
    asset: string;
    expires_at: number | null;
    sku_id: string;
  };
  clan: null;
  discriminator: string;
  global_name: string;
  id: Snowflake;
  primary_guild: null;
  public_flags: number;
  username: string;
}

/**
 * This type is only used for successful fetch action
 */
export type MutualGuild = {
  id: Snowflake;
  nick: null | string;
}