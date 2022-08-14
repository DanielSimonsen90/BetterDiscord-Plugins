import { Snowflake } from "@discord";
import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";

export interface SelectedGuildStore extends Store {
    getGuildId(): Snowflake;
    getLastSelectedGuildId(): Snowflake;
    getLastSelectedTimestamp(guildId: Snowflake): number;
    getState(): {
        selectedGuildTimestampMillis: Record<Snowflake, number>;
    }
}
export const SelectedGuildStore: SelectedGuildStore = Finder.byProps("getLastSelectedGuildId");
export default SelectedGuildStore;