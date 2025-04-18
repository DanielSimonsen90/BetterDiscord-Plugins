import { buildCheckboxItemElement, PatchGuildContextMenu } from "@context-menus";
import { ContextMenuUtils } from "@utils";
import HiddenChannelStore from "../../stores/HiddenChannelStore";

export default function patchGuildContextMenu() {
  PatchGuildContextMenu((menu, props) => {
    if (!('guild' in props)) return;

    const visibilityOptions = ContextMenuUtils.getGroupContaining('hide-muted-channels', menu);
    if (!visibilityOptions) return;

    visibilityOptions.push(buildCheckboxItemElement(
      'show-hidden-channels',
      'Show Hidden Channels',
      HiddenChannelStore.showsHiddenChannels(props.guild.id),
      () => HiddenChannelStore.showsHiddenChannels(props.guild.id)
        ? HiddenChannelStore.hideHiddenChannels(props.guild.id)
        : HiddenChannelStore.showHiddenChannels(props.guild.id)
    ));
  })
}