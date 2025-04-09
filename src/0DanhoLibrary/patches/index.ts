import afterChannelItem from "./after/ChannelItem";
import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterUserActivityStatus from "./after/UserActivityStatus";
import afterUserHeaderUsername from './after/UserHeaderUsername'

import PatchChannelContextMenu from "./context-menus/ChannelContextMenu";
import PatchGuildContextMenu from "./context-menus/GuildContextMenu";

export default function Patch() {
  PatchChannelContextMenu();
  PatchGuildContextMenu();

  afterChannelItem();
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterUserActivityStatus();
  afterUserHeaderUsername();
}