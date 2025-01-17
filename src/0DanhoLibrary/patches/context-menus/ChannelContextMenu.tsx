import ChannelContextMenu from '@danho-lib/ContextMenus/ChannelContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import AddJoinWithCameraChannelContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/join-voice-with-camera/AddJoinWithCameraChannelContextMenu';

export default function PatchChannelContextMenu() {
  if (!Settings.current.joinVoiceWithCamera) return;

  ChannelContextMenu((menu, props) => {
    if (Settings.current.joinVoiceWithCamera) AddJoinWithCameraChannelContextMenu(menu, props);
  });
}