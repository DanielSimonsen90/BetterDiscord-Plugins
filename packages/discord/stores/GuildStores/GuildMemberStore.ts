import { GuildMember, Snowflake } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface GuildMemberStore extends Store {
  getCommunicationDisabledUserMap();
  getCommunicationDisabledVersion();
  getMember(guild: Snowflake, user: Snowflake): GuildMember;
  getMemberIds(guild: Snowflake): Snowflake[];
  getMembers(guild: Snowflake): GuildMember[];
  getMutableAllGuildsAndMembers();
  getNick(guild: Snowflake, user: Snowflake): string;
  getNicknameGuildsMapping(user: Snowflake): Record<string, Snowflake[]>;
  getNicknames(user: Snowflake): string[];
  isMember(guild: Snowflake, user: Snowflake): boolean;
  memberOf(arg: any): any;
  __getLocalVars(): any;
}

export const GuildMemberStore = Finder.byName<GuildMemberStore>("GuildMemberStore");