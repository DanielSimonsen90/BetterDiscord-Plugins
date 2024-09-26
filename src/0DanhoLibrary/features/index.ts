import * as PrettyRoles from "./pretty-roles";
import * as Badges from "./badges";
import * as PronounsPageLinks from "./pronouns-page-links";
import * as SortForumsByAuthor from "./sort-forums-by-author";

const features = [
  PrettyRoles,
  Badges,
  PronounsPageLinks,
  SortForumsByAuthor
];

export const Features = () => features.forEach(feature => feature.default());
export const styles = features.map(feature => 'style' in feature ? feature.style : '').join("\n\n");