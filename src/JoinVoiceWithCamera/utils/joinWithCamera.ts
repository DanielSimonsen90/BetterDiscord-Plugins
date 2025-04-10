import { Snowflake } from "@discord/types";
import { VoiceActions } from "@actions";
import { RTCConnectionStore } from "@stores";

import JoinWithCameraManager from "./JoinWithCameraManager";
import enableCamera from "./enableCamera";

export default async function joinWithCamera(channelId: Snowflake) {
  JoinWithCameraManager.instance.set(channelId, true);

  if (RTCConnectionStore.isDisconnected() || RTCConnectionStore.getRTCConnection?.().channelId !== channelId) VoiceActions.handleVoiceConnect({ channelId });
  else enableCamera();
}