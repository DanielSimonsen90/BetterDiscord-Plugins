import { $ } from "@danho-lib/DOM";
import ChannelItem from "@danho-lib/Patcher/ChannelItem";
import { Channel } from "@discord/types";
import { Patcher } from "@dium";
import joinWithCamera from "src/JoinVoiceWithCamera/utils/joinWithCamera";

export default function afterChannelItem() {
  Patcher.after(ChannelItem, 'Z', ({ args: [props] }) => {
    if (!props.children?.props?.children?.[1]?.props?.channel) return;

    const channel = props.children.props.children[1].props.channel as Channel;
    if (!channel) return;

    const { className, 'data-dnd-name': dndName } = props.children.props as Record<string, string>;
    const node = $(s => s.className(className).and.data('dnd-name', dndName));
    node?.on('dblclick', (e) => {
      e.preventDefault();
      joinWithCamera(channel.id);
    });
  }, { name: 'ChannelItem' })
}