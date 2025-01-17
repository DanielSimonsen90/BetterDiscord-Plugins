import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";
import PatchChannelContextMenu from "@danho-lib/ContextMenus/ChannelContextMenu";
import Finder from "@danho-lib/dium/api/finder";
import { $ } from "@danho-lib/DOM";

import joinWithCamera from "./joinWithCamera";

import { Patcher } from "@dium";
import { Channel } from "@discord/types";
import { Settings } from "src/0DanhoLibrary/Settings";

export default async function Feature() {
  if (!Settings.current.joinVoiceWithCamera) return;

  PatchChannelContextMenu((menu, props) => {
    const options = menu.props.children;
    const voiceOptions = options[3].props.children;

    voiceOptions.unshift(
      buildTextItemElement(
        "join-with-camera",
        "Join with Camera",
        () => joinWithCamera(props.channel.id)
      ) as any
    );
  });

  PatchHomeVoiceChannel();
}

function PatchHomeVoiceChannel() {
  const ChannelItem = Finder.findBySourceStrings("tutorialId", "visible", "shouldShow", { defaultExport: false }) as {
    Z: JSX.BD.FC<any>;
  }

  const HOME_CHANNEL_ID = '1266581800428245094';

  Patcher.after(ChannelItem, "Z", ({ args: [props] }) => {
    if (!props.children?.props?.children?.[1]?.props?.channel) return;
    
    const channel = props.children.props.children[1].props.channel as Channel;
    if (!channel || channel.id !== HOME_CHANNEL_ID) return;

    const { className, 'data-dnd-name': dndName } = props.children.props as Record<string, string>;
    const node = $(s => s.className(className).and.data('dnd-name', dndName));
    node?.on('dblclick', (e) => {
      e.preventDefault();
      joinWithCamera(HOME_CHANNEL_ID);
    });
  });
}