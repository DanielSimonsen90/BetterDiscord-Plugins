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

const ChannelSettingsActions: {
  close(): void;
  deleteChannel(channelId: Snowflake): void;
  init(e: any, t: any, n: any): void;
  open(channelId: Snowflake, guildId?: Snowflake, n?: any): void;
  removeLinkedLobby(channelId: Snowflake): Promise<void>;
  saveChannel(e: any, t: any): Promise<any>;
  selectPermissionOverwrite(overrideId: any): void;
  setSection(section: any): void;
  updateChannel(e: any): void;
  updateVoiceChannelStatus(channelId: Snowflake, status: string): Promise<any>;
} = Finder.byKeys(["open", "saveChannel", "updateVoiceChannelStatus"]);
type ChannelSettingsActions = typeof ChannelSettingsActions;

const StageChannelActions: {
  rebuildRTCActiveChannels(): void;
  selectParticipant(channelId: Snowflake, participantId: Snowflake): void;
  toggleParticipants(channelId: Snowflake, participantsOpen: boolean): void;
  toggleParticipantsList(channelId: Snowflake, participantsListOpen: any): void;
  toggleVoiceParticipantsHidden(channelId: Snowflake, voiceParticipantsHidden: boolean): void;
  updateChatOpen(channelId: Snowflake, chatOpen: boolean): void;
  updateLayout(channelId: Snowflake, videoLayout: any, appContext?: any): void;
  updateStageStreamSize(channelId: Snowflake, large: boolean): void;
  updateStageVideoLimitBoostUpsellDismissed(channelId: Snowflake, dismissed: boolean): void;
} = Finder.byKeys(["updateChatOpen"]);
type StageChannelActions = typeof StageChannelActions;

export const VoiceActions = Object.assign({},
  InternalVoiceActions,
  ChannelSettingsActions,
  StageChannelActions, 
  {
    handleVoiceConnect
  }
) as (
  typeof InternalVoiceActions &
  typeof ChannelSettingsActions &
  typeof StageChannelActions & {
    handleVoiceConnect: (
      props: {
        channelId?: Snowflake,
        bypassChangeModal?: boolean,
      }
    ) => void;
  }
)

export default VoiceActions;