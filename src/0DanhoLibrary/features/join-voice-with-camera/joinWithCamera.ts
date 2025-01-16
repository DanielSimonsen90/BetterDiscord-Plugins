import { MediaEngineStore } from "@stores";
import { Snowflake } from "@discord/types";
import Finder from "@danho-lib/dium/api/finder";
import $ from "@danho-lib/DOM/dquery";

const handleVoiceConnect = Finder.findBySourceStrings("handleVoiceConnect") as (
  props: {
    channelId?: Snowflake,
    bypassChangeModal?: boolean,
  }
) => void;
const VoiceActions = Finder.findBySourceStrings("setVideoEnabled", "setVideoDevice") as {
  setVideoEnabled: (enabled: boolean) => void;
  setVideoDevice: (deviceId: string) => void;
};
export default function joinWithCamera(channelId: Snowflake) {
  const preferredWebcamId = MediaEngineStore.getVideoDeviceId();

  handleVoiceConnect({ channelId });

  if (!preferredWebcamId) {
    BdApi.UI.showToast("No preferred webcam set", { type: "error" });

    // Turn on camera using UI button
    $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
    return;
  }
  VoiceActions.setVideoDevice(preferredWebcamId);
  VoiceActions.setVideoEnabled(true);
}