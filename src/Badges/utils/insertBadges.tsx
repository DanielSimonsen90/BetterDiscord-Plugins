import React from '@react';
import { BadgeId, BadgeList } from "@discord/components";
import { User } from '@discord/types';
import { UserStore } from '@stores';

import { Logger } from '@danho-lib/dium/api/logger';
import { $ } from "@danho-lib/DOM";
import { UrlUtils, UserUtils } from '@danho-lib/Utils';
import { PropsFromFC } from "@danho-lib/Utils/types";

import { CustomBadge } from "../components/CustomBadge";
import { BadgePositionsStore, CustomBadgesStore, DiscordBadgeStore } from "../stores";

export default function insertBadges(props: PropsFromFC<BadgeList>, result: ReturnType<BadgeList>) {
  if (!result || result.props.children.some(badge => badge.type === CustomBadge)) return;
  
  const badges = result.props.children as Array<typeof result.props.children[0]>;
  const { customBadges, users } = CustomBadgesStore.current;
  const user: User | undefined = props.displayProfile 
    ? UserStore.getUser(props.displayProfile.userId) 
    : UserUtils.getUserByUsername(getUsername());
  if (!user) return;

  const badgeWithIds = Array.from(badges).map(instance => {
    const badge = DiscordBadgeStore.findBadgeByUrl(instance.props.children.props.children.props.src, instance);
    if (!badge) Logger.warn(`Failed to find badge in DiscordBadgesStore`, instance);
    return {
      id: badge?.id as BadgeId,
      instance: instance as typeof instance | undefined,
    } as const;
  }).filter(Boolean);
  const userCustomBadgeIds = Object.entries(customBadges)
    .filter(([_, { userTags }]) => userTags 
      ? userTags.includes(user.username) 
      : true)
    .map(([badgeId]) => badgeId);
  const userPreferredBadges = (user.id in users ? users[user.id] : []) as BadgeId[];
  const compiledBadges = BadgePositionsStore.sort([
    ...badgeWithIds.map(badge => badge.id),
    ...userPreferredBadges,
    ...userCustomBadgeIds,
  ]).map(badgeId => {
    const realBadge = badgeWithIds.find(badge => badge.id === badgeId);
    if (realBadge) return realBadge.instance;

    const discordBadge = badgeId in DiscordBadgeStore.current ? DiscordBadgeStore.current[badgeId] : null;
    if (discordBadge) return <CustomBadge key={badgeId}
      iconUrl={UrlUtils.DiscordEndpoints.BADGE_ICON(discordBadge.icon)}
      name={DiscordBadgeStore.getBadgeName(badgeId as BadgeId)}
      href={discordBadge.link}
    />;

    const customBadge = badgeId in customBadges ? customBadges[badgeId] : null;
    if (customBadge) return <CustomBadge key={badgeId} {...customBadge} />;

    Logger.warn(`Failed to find badge in CustomBadgesStore`, badgeId);
    return null;
  });

  result.props.children = compiledBadges as any;
}

function getUsername() {
  return $(s => s.role('dialog').className('userTag'))?.value.toString() // Modal/Popout
    ?? $(s => s.className('userProfileOuter').className('userTag'))?.value.toString() // DM sidebar
    ?? $(s => s.className('accountProfileCard').className('usernameInnerRow'), false)
      .map(dq => dq.children(undefined, true).value.toString())[1]; // User Settings -- Discord uses "usernameInnerRow" on "Display Name" and "Username"
}