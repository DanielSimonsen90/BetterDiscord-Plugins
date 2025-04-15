import type { Snowflake, Message } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface SpamMessageRequestStore extends Store {
  getSpamChannelIds(): Array<Snowflake>;
  getSpamChannelsCount(): number;
  isAccceptedOptimistic(): boolean;
  isReady(): boolean;
  isSpam(e: any): boolean;
}

export const SpamMessageRequestStore = Finder.byName<SpamMessageRequestStore>("SpamMessageRequestStore");
export default SpamMessageRequestStore;