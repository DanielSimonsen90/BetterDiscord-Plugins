import * as PrettyRoles from "./pretty-roles";

export function Features() {
  PrettyRoles.default();
}

export const styles = [
  PrettyRoles.styles
].join("\n\n");