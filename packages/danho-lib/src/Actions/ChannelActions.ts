import { Snowflake } from "@discord/types/base";
import { Finder } from "@dium/api";

type ChannelActions = {
  disconnect(): void;
  selectChannel(channelId: Snowflake): void;
  selectPrivateChannel(userId: Snowflake): void;
  selectVoiceChannel(channelId: Snowflake): void;
}

export const ChannelActions: ChannelActions = Finder.byKeys(["selectChannel"]);
export default ChannelActions;