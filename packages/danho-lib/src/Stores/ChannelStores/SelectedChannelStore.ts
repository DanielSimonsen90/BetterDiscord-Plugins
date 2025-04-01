import { Snowflake } from "@discord/types";
import { Finder } from "@dium";
import { Store } from "@dium/modules/flux";

export interface SelectedChannelStore extends Store {
  getChannelId(e?: any): Snowflake;
  getCurrentlySelectedChannelId(e?: any): Snowflake;
  getLastChannelFollowingDestination();
  getLastSelectedChannelId(e?: any): Snowflake;
  getLastSelectedChannels(e);
  getMostRecentSelectedTextChannelId(e);
  getVoiceChannelId(): Snowflake;
  __getLocalVars();
}

export const SelectedChannelStore: SelectedChannelStore = /* @__PURE__ */ Finder.byName("SelectedChannelStore");