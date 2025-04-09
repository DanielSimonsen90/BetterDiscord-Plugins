import { ActionsEmitter } from "@actions";
import RegisterSortByAuthorOptionInForums from '../features/discord-enhancements/sort-forums-by-author/onChannelSelect';
import { Settings } from "../Settings";

export default function onChannelSelect() {
  if (!Settings.current.allowForumSortByAuthor) return;

  ActionsEmitter.on('CHANNEL_SELECT', data => {
    if (Settings.current.allowForumSortByAuthor) RegisterSortByAuthorOptionInForums(data);
  })
}