import afterBadgeList from "./after/BadgeList";
import afterChannelItem from "./after/ChannelItem";
import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterRolesList from "./after/RolesList";
import afterTextModule from "./after/TextModule";
import afterUserHeaderUsername from './after/UserHeaderUsername'
import afterUserProfileModalAboutMe from "./after/UserProfileModalAboutMe";

import PatchChannelContextMenu from "./context-menus/ChannelContextMenu";
import PatchGuildContextMenu from "./context-menus/GuildContextMenu";
import PatchRoleContextMenu from "./context-menus/RoleContextMenu";
import PatchUserContextMenu from "./context-menus/UserContextMenu";

import insteadRolesList from "./instead/RolesList";

export default function Patch() {
  PatchChannelContextMenu();
  PatchGuildContextMenu();
  PatchRoleContextMenu();
  PatchUserContextMenu();

  afterBadgeList();
  afterChannelItem();
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterRolesList();
  afterTextModule();
  afterUserHeaderUsername();
  afterUserProfileModalAboutMe();
  
  insteadRolesList();
}