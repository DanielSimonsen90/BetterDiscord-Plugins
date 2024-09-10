import { Snowflake } from "@discord/types/base";
import { Guild } from "@discord/types/guild";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface GuildStore extends Store {
  getGuild(id: Snowflake): Guild;
  getGuildCount(): number;
  getGuilds(): Record<Snowflake, Guild>;
  __getLocalVars(): any;
}
export const GuildStore: GuildStore = Finder.byName("GuildStore");
export default GuildStore;