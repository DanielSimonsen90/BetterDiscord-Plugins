import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";
import PatchChannelContextMenu from "@danho-lib/ContextMenus/ChannelContextMenu";

import Finder from "@danho-lib/dium/api/finder";
import { $ } from "@danho-lib/DOM";

import { Snowflake } from "@discord/types";
import { Logger } from "@dium";
import { MediaEngineStore } from "@stores";

export default function Feature() {
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

  PatchChannelContextMenu((menu, props) => {
    const options = menu.props.children;
    const voiceOptions = options[3].props.children;

    voiceOptions.unshift(
      buildTextItemElement(
        "join-with-camera",
        "Join with Camera",
        () => {
          const preferredWebcamId = MediaEngineStore.getVideoDeviceId()
          
          handleVoiceConnect({ channelId: props.channel.id }); 

          if (!preferredWebcamId) {
            BdApi.UI.showToast("No preferred webcam set", { type: "error" });

            // Turn on camera using UI button
            $(s => s.className('button', 'button').ariaLabelContains("Turn On Camera"))?.element?.click();
            return;
          }
          VoiceActions.setVideoDevice(preferredWebcamId);
          VoiceActions.setVideoEnabled(true);
        }
      ) as any
    )

    Logger.log('ChannelContextMenu', { menu, props });
  });
}