import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";

const InternalVoiceActions = Finder.findBySourceStrings("setVideoEnabled", "setVideoDevice") as {
  setVideoEnabled: (enabled: boolean) => void;
  setVideoDevice: (deviceId: string) => void;
};

const handleVoiceConnect = Finder.findBySourceStrings("handleVoiceConnect") as (
  props: {
    channelId?: Snowflake,
    bypassChangeModal?: boolean,
  }
) => void;

export const VoiceActions = Object.assign({}, InternalVoiceActions, { 
  handleVoiceConnect 
});

export default VoiceActions;