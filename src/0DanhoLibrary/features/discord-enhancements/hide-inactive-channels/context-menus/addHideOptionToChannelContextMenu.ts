import { buildTextItemElement } from '@danho-lib/ContextMenus/Builder';
import { Callback } from '@danho-lib/ContextMenus/ChannelContextMenu';
import { getGroupContaining } from '@danho-lib/Utils/ContextMenu';
import HiddenChannelStore from '../stores/HiddenChannelStore';

const menuItemIds = [
  'opt-into-channel',
  'opt-out-category',
]

const patched: Callback = (menu, props) => {
  const visibilityOptions = menuItemIds.map(id => getGroupContaining(id, menu)).find(Boolean);
  if (!visibilityOptions) return;

  const optIndex = visibilityOptions.findIndex(item => menuItemIds.includes(item.props.id));
  const hideElement = buildTextItemElement(
    'hide-until-active',
    'Hide until active',
    () => HiddenChannelStore.hideChannel(props.channel.id)
  ) as any;
  const unhideElement = buildTextItemElement(
    'unhide-until-active',
    'Unhide until active',
    () => HiddenChannelStore.showChannel(props.channel.id)
  ) as any;

  visibilityOptions.splice(optIndex + 1, 0, HiddenChannelStore.isHidden(props.channel.id) ? unhideElement : hideElement);
}

export default patched;