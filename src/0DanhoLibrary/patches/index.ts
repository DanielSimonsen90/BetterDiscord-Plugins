import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterUserHeaderUsername from './after/UserHeaderUsername'

export default function Patch() {
  afterGlobalNavigation();
  afterMemberListItem();
  afterNameTag();
  afterUserHeaderUsername();
}