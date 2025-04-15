import { Finder } from '@injections';
import { Channel } from "@discord/types";
import { Store } from "@dium/modules/flux";

export interface ChannelStatusStore extends Store {
  getChannelStatus(channel: Channel): string;
}

export const ChannelStatusStore = Finder.byName<ChannelStatusStore>("ChannelStatusStore");
export default ChannelStatusStore;