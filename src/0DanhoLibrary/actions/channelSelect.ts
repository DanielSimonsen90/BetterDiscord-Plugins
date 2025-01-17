import { ActionsEmitter } from "@actions";
import LockChannels from '../features/danho-enhancements/lock-channels/onChannelSelect';
import RegisterSortByAuthorOptionInForums from '../features/discord-enhancements/sort-forums-by-author/onChannelSelect';
import { Settings } from "../Settings";

export default function onChannelSelect() {
  if (!Settings.current.lockChannels
    || !Settings.current.allowForumSortByAuthor
  ) return;

  ActionsEmitter.on('CHANNEL_SELECT', data => {
    if (Settings.current.lockChannels) LockChannels(data);
    if (Settings.current.allowForumSortByAuthor) RegisterSortByAuthorOptionInForums(data);
  })
}