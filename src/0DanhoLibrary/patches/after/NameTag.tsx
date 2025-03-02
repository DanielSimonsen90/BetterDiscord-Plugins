import { Logger } from '@danho-lib/dium/api/logger';
import NameTag from '@danho-lib/Patcher/NameTag';
import { Patcher } from '@dium';
import applyBirthdayIconOnNameTag from 'src/0DanhoLibrary/features/discord-enhancements/user-birthday/patches/applyBirthdayIconOnNameTag';

import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterNameTag() {
  if (!Settings.current.showBirthdayOnNameTag) return;

  Patcher.after(NameTag, 'render', (...args) => {
    if (Settings.current.showBirthdayOnNameTag) applyBirthdayIconOnNameTag(...args);
  }, { name: 'NameTag' });
}