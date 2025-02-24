import NameTag from '@danho-lib/Patcher/NameTag';
import { Patcher } from '@dium';
import applyBirthdayIconOnNameTag from 'src/0DanhoLibrary/features/discord-enhancements/user-birthday/patches/applyBirthdayIconOnNameTag';

import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterMemberListItem() {
  if (!Settings.current.showGuildMembersInHeader) return;

  Patcher.after(NameTag, 'Z', (...args) => {
    if (Settings.current.showBirthdayOnNameTag) applyBirthdayIconOnNameTag(...args);
  }, { name: 'NameTag' });
}