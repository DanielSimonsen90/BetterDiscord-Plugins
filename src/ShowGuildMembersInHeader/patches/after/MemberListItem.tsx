import { Patcher } from "@dium";

import MemberListItem from "@danho-lib/Patcher/MemberListItem";
import updateHeader from "src/ShowGuildMembersInHeader/utils/updateHeader";

export default function afterMemberListItem() {
  Patcher.after(MemberListItem, 'Z', () => updateHeader(), { name: 'MemberListItem' });
}