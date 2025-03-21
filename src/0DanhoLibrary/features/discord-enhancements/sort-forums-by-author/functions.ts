import { $ } from "@danho-lib/DOM";
import * as Logger from '@danho-lib/dium/api/logger';
import { ChannelStore } from "@stores";

import { addSortByAuthorOnDOM } from "./actions";
import { ChannelTypes } from "@discord/types/channel/types";
export function addSortAndViewButtonClick() {
  if (!testForumChannel()) return;

  const sortAndViewButton = $(s => s.ariaLabel('Sort & view').and.type('button'));
  sortAndViewButton?.on('click', addSortByAuthorOnDOM);
  Logger.debugLog(sortAndViewButton ? 'Sort and view button found' : 'Sort and view button not found');
};

function testForumChannel() {
  const [_blank, _channelsString, _guildId, channelId] = window.location.pathname.split('/');
  const channel = ChannelStore.getChannel(channelId);
  if (!channel) return false;
  return channel.type === ChannelTypes.GuildForum;
}