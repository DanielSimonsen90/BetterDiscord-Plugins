import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";
import { Store } from "@dium/modules/flux";

export interface ReadStateStore extends Store {
  hasAnyUnread(): boolean;
  hasUnread(channelId: Snowflake): boolean;
  getUnreadCount(channelId: Snowflake): number;
}

export const ReadStateStore: ReadStateStore = Finder.byName("ReadStateStore");
export default ReadStateStore;