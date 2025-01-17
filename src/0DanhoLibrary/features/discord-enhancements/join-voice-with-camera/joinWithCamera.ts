import { MediaEngineStore } from "@stores";
import { Snowflake } from "@discord/types";
import $ from "@danho-lib/DOM/dquery";
import { createActionCallback, VoiceActions } from "@actions";
import { RTCConnectionStore } from '@stores';
import { UserUtils } from "@danho-lib/Utils";
import JoinWithCameraManager from "./JoinWithCameraManager";

export default async function joinWithCamera(channelId: Snowflake) {
  JoinWithCameraManager.instance.set(channelId, true);

  if (RTCConnectionStore.isDisconnected() 
    || RTCConnectionStore.getRTCConnection?.().channelId !== channelId) {
    VoiceActions.handleVoiceConnect({ channelId });
  } else enableCamera();
}

export const onVoiceStatesUpdates = createActionCallback('VOICE_STATE_UPDATES', ({ voiceStates }) => {
  const { channelId, shouldEnableCamera } = JoinWithCameraManager.instance.get();

  const update = voiceStates.find(state => state.channelId === channelId && state.userId === UserUtils.me.id);
  if (!update || !shouldEnableCamera) return;

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