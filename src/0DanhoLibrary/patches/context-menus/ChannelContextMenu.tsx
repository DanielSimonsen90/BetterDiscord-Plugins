import ChannelContextMenu from '@danho-lib/ContextMenus/ChannelContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import AddJoinWithCameraChannelContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/join-voice-with-camera/AddJoinWithCameraChannelContextMenu';

export default function PatchChannelContextMenu() {
  const { joinVoiceWithCamera } = Settings.current;
  if (!joinVoiceWithCamera) return;

  ChannelContextMenu((...args) => {
    if (joinVoiceWithCamera) AddJoinWithCameraChannelContextMenu(...args);
  });
}