import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";

const InternalVoiceActions = Finder.findBySourceStrings<{
  setVideoEnabled: (enabled: boolean) => void;
  setVideoDevice: (deviceId: string) => void;
}>("setVideoEnabled", "setVideoDevice");

const handleVoiceConnect = Finder.findBySourceStrings<(
  props: {
    channelId?: Snowflake,
    bypassChangeModal?: boolean,
  }
) => void>("handleVoiceConnect");

export const VoiceActions = Object.assign({}, InternalVoiceActions, { 
  handleVoiceConnect 
});

export default VoiceActions;