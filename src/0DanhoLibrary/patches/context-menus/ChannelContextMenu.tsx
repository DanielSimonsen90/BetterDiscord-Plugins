import ChannelContextMenu from '@danho-lib/ContextMenus/ChannelContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import AddJoinWithCameraChannelContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/join-voice-with-camera/AddJoinWithCameraChannelContextMenu';
import AddHideOptionToContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/hide-inactive-channels/context-menus/addHideOptionToChannelContextMenu';

export default function PatchChannelContextMenu() {
  const { joinVoiceWithCamera, hideChannelUntilActivity } = Settings.current;
  if (!joinVoiceWithCamera || !hideChannelUntilActivity) return;

  ChannelContextMenu((...args) => {
    if (joinVoiceWithCamera) AddJoinWithCameraChannelContextMenu(...args);
    if (hideChannelUntilActivity) AddHideOptionToContextMenu(...args);
  });
}