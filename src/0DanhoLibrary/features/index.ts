import * as PrettyRoles from "./pretty-roles";
import * as Badges from "./badges";
import * as PronounsPageLinks from "./pronouns-page-links";
import * as SortForumsByAuthor from "./sort-forums-by-author";
import * as ExpandBioAgain from './expand-bio-again';
import * as WakeUp from './wake-up';
import * as BlockFriendRequests from './auto-cancel-friend-requests';
import * as ShowGuildMembersInHeader from './show-guild-members-in-header';
import * as QuickAddMemberToDungeon from './quick-add-member-to-dungeon';
import * as LockHello from './lock-hello';
import * as JoinVoiceWithCamera from './join-voice-with-camera';
import * as NonObnoxiousProfileEffects from './non-obnoxious-profile-effects';

const features = [
  PrettyRoles,
  Badges,
  PronounsPageLinks,
  SortForumsByAuthor,
  ExpandBioAgain,
  WakeUp,
  BlockFriendRequests,
  ShowGuildMembersInHeader,
  QuickAddMemberToDungeon,
  LockHello,
  JoinVoiceWithCamera,
  NonObnoxiousProfileEffects
];

export const Features = () => features.forEach(feature => feature.default());
export const styles = features.map(feature => 
  'styles' in feature ? feature.styles 
  : 'style' in feature ? feature.style
  : ''
).join("\n\n");