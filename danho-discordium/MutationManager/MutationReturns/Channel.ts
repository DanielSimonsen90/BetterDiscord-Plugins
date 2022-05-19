import { Channel, ChannelInputType, Guild } from "danho-bd/discord";
import ChannelManipulator from "danho-discordium/DomManipulator/Channel";

export type ChannelReturns = [props: {
        channel: Channel,
        chatInputType: ChannelInputType,
        guild: Guild,
        renderThreadNotice: boolean
    }, manipulator: ChannelManipulator
];
export default ChannelReturns;