import type { User } from "../user";

export type GuildMember = Pick<User, 'avatar' | 'banner' | 'bio' | 'flags'> & {
  colorString: string,
  communicatinDisabledUntil?: string,
  fullProfileLoadedTimestamp: number,
  guildId: string,
  iconRoleId: string,
  isPending: boolean,
  joinedAt: string,
  nick?: string,
  premiumSince?: string,
  roles: Array<string>,
  userId: string,
};