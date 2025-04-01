import Finder from "@danho-lib/dium/api/finder";
import { Channel, Snowflake } from "@discord/types";
import { Store } from "@dium/modules/flux";

export interface ChannelStatusStore extends Store {
  getChannelStatus(channel: Channel): string;
}

export const ChannelStatusStore: ChannelStatusStore = Finder.byName("ChannelStatusStore");
export default ChannelStatusStore;