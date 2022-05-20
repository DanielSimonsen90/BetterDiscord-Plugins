import { Channel, ChannelInputType, Guild } from "@discord";
import ChannelManipulator from "danho-discordium/DomManipulator/Channel";

export type ChannelReturns = [props: ChannelProps, manipulator: ChannelManipulator];
export default ChannelReturns;

export type ChannelProps = {
    channel: Channel,
    chatInputType: ChannelInputType,
    guild: Guild,
    renderThreadNotice: boolean
}
