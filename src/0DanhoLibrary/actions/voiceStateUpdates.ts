import { ActionsEmitter } from "@actions";
import { Settings } from "../Settings";
import { onVoiceStatesUpdates } from "../features/discord-enhancements/join-voice-with-camera/joinWithCamera";

export default function onChannelSelect() {
  if (!Settings.current.joinVoiceWithCamera) return;

  ActionsEmitter.on('VOICE_STATE_UPDATES', data => {
    if (Settings.current.joinVoiceWithCamera) onVoiceStatesUpdates(data);
  });
}