import { DanhoStores, DiumStore } from "@danho-lib/Stores";
import { GuildUtils } from "@danho-lib/Utils";
import { Snowflake } from "@discord/types";

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