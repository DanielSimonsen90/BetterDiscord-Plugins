import { Channel, Snowflake } from "@discord/types";
import { Finder } from "@dium";
import { Store } from "@dium/modules/flux";

export type ChannelStore = Store & {
  getAllThreadsForParent(e: any): any;
  getBasicChannel(channelId: Snowflake): Channel;
  getChannel(channelId: Snowflake): Channel;
  getChannelIds(e: any): Array<Snowflake>;
  getDMChannelFromUserId(e: any): any;
  getDMFromUserId(e: any): any;
  getDMUserIds(): any;
  getDebugInfo(): any;
  getGuildChannelsVersion(e: any): any;
  getInitialOverlayState(): any;
  getMutableBasicGuildChannelsForGuild(e: any): any;
  getMutableDMsByUserIds(): any;
  getMutableGuildChannelsForGuild(e: any): any;
  getMutablePrivateChannels(): any;
  getPrivateChannelsVersion(): any;
  getSortedPrivateChannels(): any;
  hasChannel(e: any): boolean;
  initialize(): any;
  loadAllGuildAndPrivateChannelsFromDisk(): any;
}

export const ChannelStore: ChannelStore = Finder.byName("ChannelStore");
export default ChannelStore;