import { ActionsEmitter } from "@actions";
import lockChannel from "../utils/lockChannel";

export default function onChannelSelect() {
  ActionsEmitter.on('CHANNEL_SELECT', async ({ channelId }) => lockChannel(channelId));
  ActionsEmitter.on('LOCK_CHANNEL', data => data?.channelId ? lockChannel(data.channelId) : undefined);
}