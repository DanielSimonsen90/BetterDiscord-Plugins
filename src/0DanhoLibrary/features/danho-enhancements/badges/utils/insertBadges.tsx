import { React } from '@react';
import { BadgeList } from "@discord/components";
import { Snowflake } from "@discord/types/base";
import { UserStore } from '@stores';

import { Logger } from '@danho-lib/dium/api/logger';
import { $ } from "@danho-lib/DOM";
import { PropsFromFC } from "@danho-lib/Utils/types";
import { UrlUtils, UserUtils } from '@danho-lib/Utils';

import { CustomBadgeData, CustomBadge } from "../components/CustomBadge";
import CustomBadgesStore from "../stores/CustomBadgesStore";
import DiscordBadgeStore, { BadgeId } from '../stores/DiscordBadgeStore';

import badgePositions from './badgePositions';
import { getBadgeName } from './getBadgeName';

export function insertBadges(props: PropsFromFC<BadgeList>, result: ReturnType<BadgeList>) {
  if (!result || result.props.children.some(badge => badge.type === CustomBadge)) return;

  const { customBadges, users } = CustomBadgesStore.current;

  const badges = result.props.children as Array<typeof result.props.children[0]>;
  const user = props.displayProfile ? UserStore.getUser(props.displayProfile.userId) : UserUtils.getUserByUsername(getUsername());
  const userCustomBadges = Object.values(customBadges)
    .filter(({ userTags }) => userTags ? user ? userTags.includes(user.username) : checkUserTag(userTags) : true)
    .sort((a, b) => getPosition(a.position, badges) - getPosition(b.position, badges))
    .map(({ size, position, ...props }) => [position, <CustomBadge key={props.name} {...props} style={{ width: size, height: size }} />] as const);

  const userPreferredBadges = (user.id in users ? users[user.id] : []) as BadgeId[];
  const badgeWithIds = Array.from(badges).map(instance => {
    const badge = DiscordBadgeStore.findBadgeByUrl(instance.props.children.props.children.props.src, instance);
    if (!badge) Logger.warn(`Failed to find badge in DiscordBadgesStore`, instance);
    return {
      id: badge?.id as BadgeId,
      instance: instance as typeof instance | undefined,
    } as const;
  }).filter(Boolean);
  const realAndPreferred = badgeWithIds.concat(userPreferredBadges.map(badgeId => ({ id: badgeId, instance: undefined })));
  const realAndPreferredWithPosition = realAndPreferred
    .map(badge => ({ ...badge, position: badgePositions().indexOf(badge.id) }))
    .sort((a, b) => a.position - b.position);

  const compiledInstances = realAndPreferredWithPosition.map(badge => {
    if (badge.instance) return badge.instance;

    const { id } = badge;
    if (!(id in DiscordBadgeStore.current)) {
      BdApi.UI.showToast(`Badge "${id}" is not saved in DiscordBadgesStore`, {
        type: 'error',
      });
      return null;
    }

    const badges = DiscordBadgeStore.current;
    const { icon, link } = badges[id];

    return <CustomBadge key={id}
      iconUrl={UrlUtils.badgeIcon(icon)}
      name={getBadgeName(id)}
      href={link}
    />;
  });

  for (const [position, badge] of userCustomBadges) {
    compiledInstances.splice(getPosition(position, compiledInstances), 0, badge as any);
  }

  result.props.children = compiledInstances as any;
}

function getUsername() {
  return $(s => s.role('dialog').className('userTag'))?.value.toString() // Modal/Popout
    ?? $(s => s.className('userProfileOuter').className('userTag'))?.value.toString() // DM sidebar
    ?? $(s => s.className('accountProfileCard').className('usernameInnerRow'), false)
      .map(dq => dq.children(undefined, true).value.toString())[1]; // User Settings -- Discord uses "usernameInnerRow" on "Display Name" and "Username"
}

function checkUserTag(userTags: Snowflake[]) {
  return userTags.includes(getUsername());
}
function getPosition(position: CustomBadgeData['position'], badges: Array<any>) {
  if (position === undefined || position === 'end') return badges.length;
  if (position === 'start') return 0;
  if (typeof position === 'number') return position;

  const [startIndex, endIndex] = [position.before, position.after].map((badgeType, i) => badgeType
    ? badges.findIndex(badge => badge.key.includes(badgeType.toLowerCase())) + i
    : -1
  );

  return startIndex === -1 && endIndex === -1 ? badges.length // Indexes failed; default to end
    : startIndex === -1 ? endIndex  // Start index not provided; use end index
      : endIndex === -1 ? startIndex  // End index not provided; use start index
        : position.default === undefined ? Math.max(startIndex, endIndex) - Math.min(startIndex, endIndex) // Both indexes provided; use the difference
          : position.default ?? badges.length; // Use default index if provided, otherwise use end
}