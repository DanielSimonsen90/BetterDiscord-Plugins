import { Channel, Guild, Snowflake, User } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface QuickSwitcherStore extends Store {
  channelNoticePredicate(e: any, t: number): boolean;
  getChannelHistory(): Array<Snowflake>;
  getFrequentGuilds(): null;
  getFrequentGuildsLength(): number;
  getProps(): QuickSwitcherStoreProps;
  getResultTotals(e: any): number;
  getState(): QuickSwitcherStoreState;
  isOpen(): boolean;
}

export const QuickSwitcherStore = Finder.byName<QuickSwitcherStore>("QuickSwitcherStore");
export default QuickSwitcherStore;

export type QuickSwitcherStoreProps = {
  maxQueryLength: number;
  query: string;
  queryMode: null;
  seenTutorial: boolean;
  selectedIndex: number;
  theme: string;
  results: Array<QuickSwitcherResult>
}

type QuickSwitcherBaseResult<TRecord> = {
  comparator: string;
  record: TRecord;
  score: number;
  type: string;
}

type QuickSwitcherUserResult = QuickSwitcherBaseResult<User> & {
  type: 'USER';
}

type QuickSwitcherChannelResult = QuickSwitcherBaseResult<Channel> & {
  type: `${'TEXT' | 'VOICE'}_CHANNEL`;
  sortable: string;
  record: Channel & { guild_id: Snowflake };
}

type QuickSwitcherGuildResult = QuickSwitcherBaseResult<Guild> & {
  type: 'GUILD';
  sortable: string;
}

export type QuickSwitcherResult = QuickSwitcherUserResult | QuickSwitcherChannelResult | QuickSwitcherGuildResult;

type QuickSwitcherStoreState = {
  channelHistory: Array<Snowflake>;
}