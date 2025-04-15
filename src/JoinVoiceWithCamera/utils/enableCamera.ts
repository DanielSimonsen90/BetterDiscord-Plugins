import { MediaEngineStore } from "@discord/stores";
import { VoiceActions } from "@actions";
import { $ } from "@dom";

export default function enableCamera() {
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