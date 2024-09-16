import * as PrettyRoles from "./pretty-roles";
import * as MemberListTabBar from './MemberListTabBar';

export function Features() {
  PrettyRoles.default();
  MemberListTabBar.default();
}

export const styles = [
  PrettyRoles.styles,
  MemberListTabBar.styles,
].join("\n\n");