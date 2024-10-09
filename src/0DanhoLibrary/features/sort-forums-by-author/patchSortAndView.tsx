import { ActionsEmitter } from "@actions";
import { ChannelStore } from "@stores";
import { $ } from "@danho-lib/DOM";
import * as Logger from '@danho-lib/dium/api/logger';

import { ChannelTypes } from "@dium/modules/channel";
import { sleep } from "@dium/utils";
import { addSortByAuthorOnDOM } from "./actions";

export default async function patchSortAndView() {
  const addSortAndViewButtonClick = () => {
    if (!testForumChannel()) return;

    const sortAndViewButton = $(s => s.ariaLabel('Sort & view').and.type('button'));
    sortAndViewButton?.on('click', addSortByAuthorOnDOM);
    Logger.debugLog(sortAndViewButton ? 'Sort and view button found' : 'Sort and view button not found');
  };

  addSortAndViewButtonClick();
  ActionsEmitter.on('CHANNEL_SELECT', async () => {
    await sleep(1000);
    addSortAndViewButtonClick();
  });
}

function testForumChannel() {
  const [_blank, _channelsString, _guildId, channelId] = window.location.pathname.split('/');
  const channel = ChannelStore.getChannel(channelId);
  if (!channel) return false;
  return channel.type === ChannelTypes.GuildForum;
}