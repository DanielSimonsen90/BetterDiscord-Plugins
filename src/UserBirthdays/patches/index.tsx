import afterGlobalNavigation from "./after/GlobalNavigation";
import afterMemberListItem from "./after/MemberListItem";
import afterNameTag from "./after/NameTag";
import afterUserHeaderUsername from "./after/UserHeaderUsername";

export default function patch() {
	afterGlobalNavigation();
	afterMemberListItem();
	afterNameTag();
	afterUserHeaderUsername();
}