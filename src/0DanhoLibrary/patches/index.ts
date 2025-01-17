import afterBadgeList from "./after/BadgeList";
import afterChannelItem from "./after/ChannelItem";
import afterMemberListItem from "./after/MemberListItem";
import afterRolesList from "./after/RolesList";
import afterTextModule from "./after/TextModule";
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
  afterMemberListItem();
  afterRolesList();
  afterTextModule();
  afterUserProfileModalAboutMe();
  
  insteadRolesList();
}