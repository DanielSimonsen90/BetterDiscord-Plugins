import { Snowflake } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface GuildMemberCountStore extends Store {
  getMemberCount(guildId: Snowflake): number | null;
  getMemberCounts(): Record<Snowflake, number>;
  getOnlineCount(guildId: Snowflake): number | null;
}

export const GuildMemberCountStore = Finder.byName<GuildMemberCountStore>("GuildMemberCountStore");