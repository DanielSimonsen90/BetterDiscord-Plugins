import afterBadgeList from "./after/BadgeList";
import afterChannelItem from "./after/ChannelItem";
import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterQuickSwitcherStore_getProps from "./after/QuickSwitcherStore-getProps";
import afterRolesList from "./after/RolesList";
import afterTextModule from "./after/TextModule";
import afterUserActivityStatus from "./after/UserActivityStatus";
import afterUserHeaderUsername from './after/UserHeaderUsername'
import afterUserProfileModalAboutMe from "./after/UserProfileModalAboutMe";

import PatchChannelContextMenu from "./context-menus/ChannelContextMenu";
import PatchGuildContextMenu from "./context-menus/GuildContextMenu";
import PatchRoleContextMenu from "./context-menus/RoleContextMenu";
import PatchUserContextMenu from "./context-menus/UserContextMenu";

import Extensions from './extensions';

import insteadRolesList from "./instead/RolesList";

export default function Patch() {
  Extensions();
  
  PatchChannelContextMenu();
  PatchGuildContextMenu();
  PatchRoleContextMenu();
  PatchUserContextMenu();

  afterBadgeList();
  afterChannelItem();
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterQuickSwitcherStore_getProps();
  afterRolesList();
  afterTextModule();
  afterUserActivityStatus();
  afterUserHeaderUsername();
  afterUserProfileModalAboutMe();
  
  insteadRolesList();
}