import { Snowflake } from "@discord/types";
import { DanhoStores, DiumStore } from "@stores";
import { GuildUtils } from "@utils";

  const ScrollerStore = new class GuildChannelListScrollerStore extends DiumStore<Record<Snowflake, number>> {
    constructor() {
      super({}, 'GuildChannelListScrollerStore');
    }

    public getInstance() {
      const currentGuildId = GuildUtils.currentId;

      return {
        update: (scrollTop: number) => currentGuildId ? this.update({ [currentGuildId]: scrollTop }) : null,
        getScrollState: () => this.current[currentGuildId] ?? 0,
      }
    }
  }

  DanhoStores.register(ScrollerStore);
  export default ScrollerStore;