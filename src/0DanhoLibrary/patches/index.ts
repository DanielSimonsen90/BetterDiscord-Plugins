import afterChannelItem from "./after/ChannelItem";
import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterQuickSwitcherStore_getProps from "./after/QuickSwitcherStore-getProps";
import afterUserActivityStatus from "./after/UserActivityStatus";
import afterUserHeaderUsername from './after/UserHeaderUsername'

import PatchChannelContextMenu from "./context-menus/ChannelContextMenu";
import PatchGuildContextMenu from "./context-menus/GuildContextMenu";
import PatchUserContextMenu from "./context-menus/UserContextMenu";

import Extensions from './extensions';

export default function Patch() {
  Extensions();
  
  PatchChannelContextMenu();
  PatchGuildContextMenu();
  PatchUserContextMenu();

  afterChannelItem();
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterQuickSwitcherStore_getProps();
  afterUserActivityStatus();
  afterUserHeaderUsername();
}