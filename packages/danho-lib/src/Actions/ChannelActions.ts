import { Snowflake } from "@discord/types/base";
import Finder from "../Injections/finder";

type ChannelActions = {
  disconnect(): void;
  selectChannel(props: {
    guildId: Snowflake;
    channelId: Snowflake;
    messageId?: Snowflake;
    jumpType?: any;
    preserveDrawerState?: boolean;
    source: string;
  }): void;
  selectPrivateChannel(userId: Snowflake): void;
  selectVoiceChannel(channelId: Snowflake): void;
}

export const ChannelActions = Finder.byKeys<ChannelActions>(["selectChannel"]);
export default ChannelActions;