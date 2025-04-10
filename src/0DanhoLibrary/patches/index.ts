import afterChannelItem from "./after/ChannelItem";
import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterUserHeaderUsername from './after/UserHeaderUsername'

import PatchChannelContextMenu from "./context-menus/ChannelContextMenu";

export default function Patch() {
  PatchChannelContextMenu();

  afterChannelItem();
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterUserHeaderUsername();
}