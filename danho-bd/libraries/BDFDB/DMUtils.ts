import { Channel } from "@discord";

type DMUtils = {
    isDMChannel(channel: any): channel is Channel,
    getIcon(id: string): string,
    markAsRead(channelIds: Array<string>): void,
}
export default DMUtils;