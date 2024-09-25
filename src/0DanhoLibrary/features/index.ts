import * as PrettyRoles from "./pretty-roles";
import * as Badges from "./badges";
import * as PronounsPageLinks from "./pronouns-page-links";

export function Features() {
  PrettyRoles.default();
  Badges.default();
  PronounsPageLinks.default();
}

export const styles = [
  PrettyRoles.styles,
  // Badges.styles
  // PronounsPageLinks.styles
].join("\n\n");