import * as UserBirthday from './user-birthday';

import UserTimezoneStyle from './user-timezone/style.scss';

export default [
  UserBirthday,
  { style: UserTimezoneStyle, default: () => { } },
];