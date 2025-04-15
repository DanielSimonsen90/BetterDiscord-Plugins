import { Snowflake } from "@discord/types/base";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface SelectedGuildStore extends Store {
  getGuildId(): Snowflake;
  getLastSelectedGuildId(): Snowflake;
  getLastSelectedTimestamp(guildId: Snowflake): number;
  getState(): {
    selectedGuildTimestampMillis: Record<Snowflake, number>;
  };
}
export const SelectedGuildStore = Finder.byKeys<SelectedGuildStore>(["getLastSelectedGuildId"]);
export default SelectedGuildStore;