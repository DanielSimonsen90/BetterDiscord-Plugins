import { buildTextItemElement, PatchChannelContextMenu } from "@context-menus";
import { ContextMenuUtils } from "@utils";
import HiddenChannelStore from "../../stores/HiddenChannelStore";

const menuItemIds = [
  'opt-into-channel',
  'opt-out-category',
]

export default function patchChannelContextMenu() {
  PatchChannelContextMenu((menu, props) => {
    const visibilityOptions = menuItemIds.map(id => ContextMenuUtils.getGroupContaining(id, menu)).find(Boolean);
    if (!visibilityOptions) return;

    const optIndex = visibilityOptions.findIndex(item => menuItemIds.includes(item.props.id));
    const hideElement = buildTextItemElement(
      'hide-until-active',
      'Hide until active',
      () => HiddenChannelStore.hideChannel(props.channel.id)
    );
    const unhideElement = buildTextItemElement(
      'unhide-until-active',
      'Unhide until active',
      () => HiddenChannelStore.showChannel(props.channel.id)
    );

    visibilityOptions.splice(optIndex + 1, 0, HiddenChannelStore.isHidden(props.channel.id) ? unhideElement : hideElement);
  })
}