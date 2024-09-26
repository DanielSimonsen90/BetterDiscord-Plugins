import Finder from "@danho-lib/dium/api/finder";
import { Functionable } from "@danho-lib/Utils/types";
import { Snowflake } from "@discord/types/base";

type ForumStateManagerModule = {
  H(channelId: Snowflake): ForumStateManager;
  v(): ForumStateManager;
};
export const ForumStateManagerModule: ForumStateManagerModule = Finder.BDFDB_findByStrings(['setSortOrder', 'setChannelState']);

type ForumStateManager = {
  channelStates: ChannelStates;
  get(): ForumStateManager;
  getChannelState(channelId: Snowflake): ChannelStates;

  set(e: Functionable<any>, t: any): ForumStateManager
  setChannelState(channelId: Snowflake, state: ChannelStates): void;
  setLayoutType(channelId: Snowflake, layoutType: ChannelState['layoutType']): void;
  setScrollPosition(channelId: Snowflake, scrollPosition: ChannelState['scrollPosition']): void;
  setSortOrder(channelId: Snowflake, sortOrder: ChannelState['sortOrder']): void;
  setTagFilter(channelId: Snowflake, tagFilter: ChannelState['tagFilter']): void;
  toggleTagFilter(channelId: Snowflake, tagFilter: ChannelState['tagFilter']): void;
};

type ChannelStates = {
  [channelId: Snowflake]: ChannelState
}
type ChannelState = {
  layoutType: ForumStateLayoutTypes;
  scrollPosition: number;
  sortOrder: ForumStateSortOrders;
  tagFilter: Set<any>;
}

export enum ForumStateLayoutTypes {
  LIST,
  GRID
}
export enum ForumStateSortOrders {
  CREATION_DATE,
  LATEST_ACTIVITY,
  DANHO__BY_AUTHOR
}