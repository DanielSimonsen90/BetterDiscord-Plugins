import { ActionsEmitter } from "@actions";
import { Settings } from "../Settings";
import { onVoiceChannelSelect as joinWithCamera } from "../features/discord-enhancements/join-voice-with-camera/joinWithCamera";

export default function onVoiceChannelSelect() {
  if (!Settings.current.joinVoiceWithCamera) return;

  ActionsEmitter.on('VOICE_CHANNEL_SELECT', data => {
    if (Settings.current.joinVoiceWithCamera) joinWithCamera(data);
  });
}