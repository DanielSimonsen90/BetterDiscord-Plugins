import { createActionCallback, VoiceActions } from "@actions";
import { MediaEngineStore, RTCConnectionStore } from "@stores";

import { Snowflake } from "@discord/types";
import $ from "@danho-lib/DOM/dquery";

import JoinWithCameraManager from "./JoinWithCameraManager";

export default async function joinWithCamera(channelId: Snowflake) {
  JoinWithCameraManager.instance.set(channelId, true);

  if (RTCConnectionStore.isDisconnected() 
    || RTCConnectionStore.getRTCConnection?.().channelId !== channelId) {
    VoiceActions.handleVoiceConnect({ channelId });
  } else enableCamera();
}

export const onVoiceChannelSelect = createActionCallback('VOICE_CHANNEL_SELECT', ({ channelId: selectedChannelId, currentVoiceChannelId }) => {
  const { channelId, shouldEnableCamera } = JoinWithCameraManager.instance.get();
  if (selectedChannelId !== channelId || !shouldEnableCamera) return;

  JoinWithCameraManager.instance.reset();
  enableCamera();
});

function enableCamera() {
  const preferredWebcamId = MediaEngineStore.getVideoDeviceId();
  if (!preferredWebcamId) {
    BdApi.UI.showToast("No preferred webcam set", { type: "error" });

    // Turn on camera using UI button
    $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
    return;
  }

  VoiceActions.setVideoDevice(preferredWebcamId);
  VoiceActions.setVideoEnabled(true);
}