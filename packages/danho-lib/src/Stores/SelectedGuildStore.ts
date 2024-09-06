import { Snowflake } from "@discord/types/base";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface SelectedGuildStore extends Store {
    getGuildId(): Snowflake;
    getLastSelectedGuildId(): Snowflake;
    getLastSelectedTimestamp(guildId: Snowflake): number;
    getState(): {
        selectedGuildTimestampMillis: Record<Snowflake, number>;
    }
}
export const SelectedGuildStore: SelectedGuildStore = Finder.byKeys(["getLastSelectedGuildId"]);
export default SelectedGuildStore;