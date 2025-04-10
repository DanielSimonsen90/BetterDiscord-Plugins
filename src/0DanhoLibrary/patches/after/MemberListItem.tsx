import MemberListItem from '@danho-lib/Patcher/MemberListItem';
import { Logger, Patcher } from '@dium';
import applyBirthdayIconOnMemberListItem from 'src/0DanhoLibrary/features/discord-enhancements/user-birthday/patches/applyBirthdayIconOnMemberListItem';

import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterMemberListItem() {
  if (!Settings.current.showGuildMembersInHeader) return;

  Patcher.after(MemberListItem, 'Z', (data) => {
    if (Settings.current.showBirthdayOnNameTag) applyBirthdayIconOnMemberListItem(data);
  }, { name: 'MemberListItem' });
}