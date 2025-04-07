import UserContextMenu from '@danho-lib/ContextMenus/UserContextMenu'
import { Settings } from 'src/0DanhoLibrary/Settings';
import addModifyBadgesToUserContextMenu from 'src/0DanhoLibrary/features/danho-enhancements/badges/patches/addModifyBadgesToUserContextMenu';
import AddMemberToDungeon from 'src/0DanhoLibrary/features/danho-enhancements/quick-add-member-to-dungeon/AddMemberToDungeonToUserContextMenu';

export default function PatchUserContextMenu() {
  if (!Settings.current.addToDungeon && !Settings.current.useClientCustomBadges) return;

  UserContextMenu((...args) => {
    if (Settings.current.addToDungeon) AddMemberToDungeon(...args);
    if (Settings.current.useClientCustomBadges) addModifyBadgesToUserContextMenu(...args);
  })
}