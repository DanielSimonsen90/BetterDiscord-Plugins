import GuildContextMenu from '@danho-lib/ContextMenus/GuildContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import blockRequestsFromGuildGuildContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/auto-cancel-friend-requests/blockRequestsFromGuildGuildContextMenu';
import addShowHiddenChannelsGuildContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/hide-inactive-channels/context-menus/addShowHiddenChannelsGuildContextMenu';

export default function PatchGuildContextMenu() {
  const { autoCancelFriendRequests, hideChannelUntilActivity } = Settings.current;
  if (!autoCancelFriendRequests && !hideChannelUntilActivity) return;

  GuildContextMenu((menu, props) => {
    if (autoCancelFriendRequests) blockRequestsFromGuildGuildContextMenu(menu, props);
    if (hideChannelUntilActivity) addShowHiddenChannelsGuildContextMenu(menu, props);
  });
}