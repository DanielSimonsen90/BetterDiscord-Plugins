import { Finder } from '@injections';
import { Snowflake } from "@discord/types";
import { Store } from "@dium/modules/flux";

export interface ReadStateStore extends Store {
  hasAnyUnread(): boolean;
  hasUnread(channelId: Snowflake): boolean;
  getUnreadCount(channelId: Snowflake): number;
}

export const ReadStateStore = Finder.byName<ReadStateStore>("ReadStateStore");
export default ReadStateStore;