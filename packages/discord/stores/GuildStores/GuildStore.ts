import type { Snowflake, Guild, Role } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export type GuildStore = Store & {
  getAllGuildsRoles(): {
    [guildId: Snowflake]: {
      [roleId: Snowflake]: Role;
    }
  }
  getGeoRestrictedGuilds(): Snowflake[];
  getGuild(id: Snowflake): Guild;
  getGuildCount(): number;
  getGuildIds(): Snowflake[];
  getGuilds(): Record<Snowflake, Guild>;
  getRole(guildId: Snowflake, roleId: Snowflake): Role;
  getRoles(guildId: Snowflake): Role[];
  isLoaded(): boolean;
}
export const GuildStore = Finder.byName<GuildStore>("GuildStore");
export default GuildStore;