import { Channel } from '@discord/types'

import ChannelItem from "@danho-lib/Patcher/ChannelItem";
import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { $ } from '@danho-lib/DOM';

import { HOME_CHANNEL_ID } from './constants';
import joinWithCamera from './joinWithCamera';

export default createPatcherAfterCallback<typeof ChannelItem['Z']>(({ args: [props] }) => {
  if (!props.children?.props?.children?.[1]?.props?.channel) return;

  const channel = props.children.props.children[1].props.channel as Channel;
  if (!channel || channel.id !== HOME_CHANNEL_ID) return;

  const { className, 'data-dnd-name': dndName } = props.children.props as Record<string, string>;
  const node = $(s => s.className(className).and.data('dnd-name', dndName));
  node?.on('dblclick', (e) => {
    e.preventDefault();
    joinWithCamera(HOME_CHANNEL_ID);
  });
})