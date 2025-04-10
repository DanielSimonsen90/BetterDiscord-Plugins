import GuildContextMenu from '@danho-lib/ContextMenus/GuildContextMenu';
import { Settings } from 'src/0DanhoLibrary/Settings';
import addShowHiddenChannelsGuildContextMenu from 'src/0DanhoLibrary/features/discord-enhancements/hide-inactive-channels/context-menus/addShowHiddenChannelsGuildContextMenu';

export default function PatchGuildContextMenu() {
  const { hideChannelUntilActivity } = Settings.current;
  if (!!hideChannelUntilActivity) return;

  GuildContextMenu((...args) => {
    if (hideChannelUntilActivity) addShowHiddenChannelsGuildContextMenu(...args);
  });
}