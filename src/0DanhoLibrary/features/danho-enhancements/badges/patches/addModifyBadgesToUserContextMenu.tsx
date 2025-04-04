import { React } from '@react';
import { UserProfileStore } from '@stores';

import {
  createContextMenuCallback,
  buildSubMenuElement, buildCheckboxItem, buildSubMenu
} from '@danho-lib/ContextMenus';
import { Logger } from '@danho-lib/dium/api/logger';
import { ContextMenuUtils, StringUtils, UrlUtils } from '@danho-lib/Utils';

import DiscordBadgeStore, { BadgeGroups, BadgeId } from '../stores/DiscordBadgeStore';
import CustomBadgesStore from '../stores/CustomBadgesStore';
import { getBadgeName } from '../utils/getBadgeName';
import { Text } from '@dium/components';
import { CustomBadge } from '../components/CustomBadge';

export default createContextMenuCallback('user', (menu, props) => {
  const profile = UserProfileStore.getUserProfile(props.user.id);
  if (!profile) return;

  const modifyBadges = ContextMenuUtils.getGroupContaining('modify-badges', menu);
  if (modifyBadges) return;

  const userActions = ContextMenuUtils.getGroupContaining('user-profile', menu);
  if (!userActions) return;

  const DiscordBadges = DiscordBadgeStore.current;
  const CustomUser = CustomBadgesStore.current.users[props.user.id] ?? [] as BadgeId[];

  userActions.push(
    buildSubMenuElement(
      'modify-badges',
      'Modify Badges',
      Object.entries(BadgeGroups).map(([group, badges]) => (
        buildSubMenu(
          `${group}-badges`,
          StringUtils.pascalCaseFromSnakeCase(group),
          badges.map((badgeId: BadgeId) => {
            const badge = DiscordBadges[badgeId];
            const name = `${getBadgeName(badgeId)} ${badgeId.includes('boost') ? `level ${badgeId.split('').pop()}` : ''}`;

            return buildCheckboxItem(
              badgeId,
              CustomBadge
                ? <div className='badge-context-option-container'>
                  <CustomBadge
                    name={name}
                    iconUrl={UrlUtils.badgeIcon(badge.icon)}
                    href={badge.link}
                    key={badgeId}
                  />
                  {name}
                </div>
                : name,
              CustomUser?.includes(badgeId),
              (checked) => {
                const badges = CustomUser;
                if (checked && !badges.includes(badgeId)) badges.push(badgeId);
                else if (!checked && badges.includes(badgeId)) badges.splice(badges.indexOf(badgeId), 1);
                else Logger.warn('Badge already exists or does not exist', { badgeId, current: badges, checked });

                CustomBadgesStore.update(current => ({
                  ...current,
                  users: {
                    ...current.users,
                    [props.user.id]: badges,
                  },
                }));
              });
          })
        )
      ))
    ) as any
  );
});