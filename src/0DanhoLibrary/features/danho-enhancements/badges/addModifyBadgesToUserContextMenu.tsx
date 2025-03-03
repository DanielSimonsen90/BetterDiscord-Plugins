import { UserProfileStore } from '@stores';
import { buildSubMenuElement, buildTextItem } from '@danho-lib/ContextMenus/Builder';
import { Callback } from '@danho-lib/ContextMenus/UserContextMenu';
import { Logger } from '@danho-lib/dium/api/logger';
import { getGroupContaining } from '@danho-lib/Utils/ContextMenu';

const patched: Callback = (menu, props) => {
  const profile = UserProfileStore.getUserProfile(props.user.id);
  if (!profile) return;

  const userActions = getGroupContaining('note', menu);

  userActions.push(buildSubMenuElement('modify-badges', 'Modify Badges', profile.badges.map((badge, id) => {
    return  buildTextItem(badge.id, formatBadgeId(badge.id), () => {
      Logger.log('Badge', badge);
    });
  })) as any)
}

export default patched;

function formatBadgeId(id: string) {
  return id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}