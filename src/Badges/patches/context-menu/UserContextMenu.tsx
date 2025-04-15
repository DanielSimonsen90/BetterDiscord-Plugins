import { React } from '@react';
import { BadgeId } from '@discord/components';
import { UserProfileStore } from '@stores';

import {
  buildSubMenuElement,
  buildCheckboxItem, buildSubMenu, buildSeparator,
  PatchUserContextMenu
} from '@danho-lib/ContextMenus';
import { Logger } from '@danho-lib/dium/api/logger';
import { ContextMenuUtils, StringUtils, UrlUtils } from '@danho-lib/Utils';
import { Unpatch } from '@danho-lib/ContextMenus/PatchTypes';


import { BadgeGroups, CustomBadgesStore, DiscordBadgeStore } from 'src/Badges/stores';
import { CustomBadge } from 'src/Badges/components/CustomBadge';
import { Settings } from 'src/Badges/settings';

let unpatchOverride: Unpatch = () => { };

const patch = () => PatchUserContextMenu((menu, props, unpatch) => {
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
      [
        ...Object.entries(BadgeGroups).map(([group, badges]) => (
          buildSubMenu(
            `${group}-badges`,
            StringUtils.pascalCaseFromSnakeCase(group),
            badges.map((badgeId: BadgeId) => {
              const badge = DiscordBadges[badgeId];
              const name = `${DiscordBadgeStore.getBadgeName(badgeId)} ${badgeId.includes('boost') ? `level ${badgeId.split('').pop()}` : ''}`;

              return buildCheckboxItem(
                badgeId,
                <div className='badge-context-option-container'>
                  <CustomBadge
                    name={name}
                    iconUrl={UrlUtils.DiscordEndpoints.BADGE_ICON(badge.icon)}
                    href={badge.link}
                    key={badgeId}
                  />
                  {name}
                </div>,
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
        )),
        buildSeparator(),
        buildSubMenu(
          "custom-badges",
          "Custom Badges",
          Object.entries(CustomBadgesStore.current.customBadges)
            .sort(([_, a], [__, b]) => a.name.localeCompare(b.name))
            .map(([id, badge]) => (
              buildCheckboxItem(
                id,
                <div className='badge-context-option-container'>
                  <CustomBadge
                    name={badge.name}
                    iconUrl={badge.iconUrl}
                    href={badge.href}
                    key={id}
                  />
                  {badge.name}
                </div>,
                badge.userTags?.includes(props.user.username) ?? false,
                (checked) => {
                  const userTag = props.user.username;
                  const userTags = badge.userTags ?? new Array<string>();

                  if (checked && !userTags.includes(userTag)) userTags.push(userTag);
                  else if (!checked && userTags.includes(userTag)) userTags.splice(userTags.indexOf(userTag), 1);
                  else Logger.warn('Badge already exists or does not exist', { userTag, current: userTags, checked });

                  CustomBadgesStore.update(current => ({
                    ...current,
                    customBadges: {
                      ...current.customBadges,
                      [id]: {
                        ...badge,
                        userTags
                      },
                    },
                  }));
                }
              )
            )
            )
        )
      ]
    ) as any
  );

  unpatchOverride = unpatch;
});

CustomBadgesStore.addListener(() => {
  unpatchOverride();
  if (Settings.current.useClientCustomBadges) PatchUserContextMenu(patch());
});

export default patch();
