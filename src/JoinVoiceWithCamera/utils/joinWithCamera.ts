import { Snowflake } from "@discord/types";
import { RTCConnectionStore } from "@discord/stores";
import { VoiceActions } from "@actions";

import JoinWithCameraManager from "./JoinWithCameraManager";
import enableCamera from "./enableCamera";

export default async function joinWithCamera(channelId: Snowflake) {
  JoinWithCameraManager.instance.set(channelId, true);

  if (RTCConnectionStore.isDisconnected() || RTCConnectionStore.getRTCConnection?.().channelId !== channelId) VoiceActions.handleVoiceConnect({ channelId });
  else enableCamera();
}