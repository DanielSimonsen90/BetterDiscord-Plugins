import type { Snowflake } from "@discord/types/base";
import type { Guild } from "@discord/types/guild";
import type { Role } from "@discord/types/guild/role";

import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface GuildStore extends Store {
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
export const GuildStore: GuildStore = Finder.byName("GuildStore");
export default GuildStore;