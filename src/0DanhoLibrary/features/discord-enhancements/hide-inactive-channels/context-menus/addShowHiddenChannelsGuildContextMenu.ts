import { buildCheckboxItemElement } from '@danho-lib/ContextMenus/Builder';
import { Callback } from '@danho-lib/ContextMenus/GuildContextMenu';
import { getGroupContaining } from '@danho-lib/Utils/ContextMenu';
import HiddenChannelStore from '../stores/HiddenChannelStore';

const patched: Callback = (menu, props) => {
  if (!('guild' in props)) return;

  const visibilityOptions = getGroupContaining('hide-muted-channels', menu);
  if (!visibilityOptions) return;

  visibilityOptions.push(buildCheckboxItemElement(
    'show-hidden-channels',
    'Show Hidden Channels',
    HiddenChannelStore.showsHiddenChannels(props.guild.id),
    () => HiddenChannelStore.showsHiddenChannels(props.guild.id) 
      ? HiddenChannelStore.hideHiddenChannels(props.guild.id) 
      : HiddenChannelStore.showHiddenChannels(props.guild.id)
  ) as any);
};

export default patched;