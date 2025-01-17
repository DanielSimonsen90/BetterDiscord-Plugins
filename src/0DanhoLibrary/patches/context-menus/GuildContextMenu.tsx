import GuildContextMenu from '@danho-lib/ContextMenus/GuildContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import BlockRequestsFromGuildGuildContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/auto-cancel-friend-requests/BlockRequestsFromGuildGuildContextMenu';

export default function PatchGuildContextMenu() {
  if (!Settings.current.autoCancelFriendRequests) return;

  GuildContextMenu((menu, props) => {
    if (Settings.current.autoCancelFriendRequests) BlockRequestsFromGuildGuildContextMenu(menu, props);
  });
}