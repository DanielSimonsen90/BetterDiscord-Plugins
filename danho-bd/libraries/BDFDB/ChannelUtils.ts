import { Channel } from "@discord";

type ChannelResolable = Channel | string;
type ChannelUtils = {
    is(channel: any): channel is Channel,
    isTextChannel(channelResolable: ChannelResolable): channelResolable is Channel,
    isThread(channelResolable: ChannelResolable): channelResolable is Channel,
    isEvent(channelResolable: ChannelResolable): channelResolable is Channel,
    markAsRead(channelIds: Array<string>): void,
    rerenderAll(instant: boolean): void,
}
export default ChannelUtils;