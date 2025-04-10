// import * as JoinVoiceWithCamera from './join-voice-with-camera';
import * as ShowGuildMembersInHeader from './show-guild-members-in-header';
import * as SortForumsByAuthor from './sort-forums-by-author';
import * as UserBirthday from './user-birthday';

import UserTimezoneStyle from './user-timezone/style.scss';

export default [
  // JoinVoiceWithCamera,
  ShowGuildMembersInHeader,
  SortForumsByAuthor,
  UserBirthday,
  { style: UserTimezoneStyle, default: () => { } },
];