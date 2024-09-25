import * as PrettyRoles from "./pretty-roles";
import * as Badges from "./badges";

export function Features() {
  PrettyRoles.default();
  Badges.default();
}

export const styles = [
  PrettyRoles.styles,
  // Badges.styles
].join("\n\n");