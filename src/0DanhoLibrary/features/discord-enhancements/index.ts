import * as SortForumsByAuthor from './sort-forums-by-author';
import * as UserBirthday from './user-birthday';

import UserTimezoneStyle from './user-timezone/style.scss';

export default [
  SortForumsByAuthor,
  UserBirthday,
  { style: UserTimezoneStyle, default: () => { } },
];