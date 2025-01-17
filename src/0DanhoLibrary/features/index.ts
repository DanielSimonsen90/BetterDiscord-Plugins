import * as Badges from "./badges";
import * as SortForumsByAuthor from "./sort-forums-by-author";
import * as WakeUp from './wake-up';
import * as BlockFriendRequests from './auto-cancel-friend-requests';
import * as ShowGuildMembersInHeader from './show-guild-members-in-header';
import * as QuickAddMemberToDungeon from './quick-add-member-to-dungeon';
import * as LockHello from './lock-hello';
import * as JoinVoiceWithCamera from './join-voice-with-camera';

import StyleChanges from './style-changes';

const features = [
  Badges,
  SortForumsByAuthor,
  WakeUp,
  BlockFriendRequests,
  ShowGuildMembersInHeader,
  QuickAddMemberToDungeon,
  LockHello,
  JoinVoiceWithCamera,

  ...StyleChanges,
];

export const Features = () => features.forEach(feature => feature.default());
export const styles = features.map(feature => 
  'styles' in feature ? feature.styles 
  : 'style' in feature ? feature.style
  : ''
).join("\n\n");