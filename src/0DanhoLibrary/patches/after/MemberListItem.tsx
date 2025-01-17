import MemberListItem from '@danho-lib/Patcher/MemberListItem';
import { Patcher } from '@dium';
import updateGuildHeader from 'src/0DanhoLibrary/features/discord-enhancements/show-guild-members-in-header/updateGuildHeader';

import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterMemberListItem() {
  if (!Settings.current.showGuildMembersInHeader) return;

  Patcher.after(MemberListItem, 'Z', (...args) => {
    if (Settings.current.showGuildMembersInHeader) updateGuildHeader(...args);
  }, { name: 'MemberListItem' });
}