import { Patcher } from "@dium";

import MemberListItem from "@injections/patched/MemberListItem";
import updateHeader from "../../utils/updateHeader";

export default function afterMemberListItem() {
  Patcher.after(MemberListItem, 'type', () => updateHeader(), { name: 'MemberListItem' });
}