import { MediaEngineStore } from "@stores";
import { Snowflake } from "@discord/types";
import $ from "@danho-lib/DOM/dquery";
import { VoiceActions } from "@actions";

export default function joinWithCamera(channelId: Snowflake) {
  const preferredWebcamId = MediaEngineStore.getVideoDeviceId();
  VoiceActions.handleVoiceConnect({ channelId });

  if (!preferredWebcamId) {
    BdApi.UI.showToast("No preferred webcam set", { type: "error" });

    // Turn on camera using UI button
    $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
    return;
  }
  VoiceActions.setVideoDevice(preferredWebcamId);
  VoiceActions.setVideoEnabled(true);
}