import React from '@react';
import { UserStore } from "@discord/stores";
import { UrlUtils, UserUtils } from "@utils";
import { BadgePositionsStore, CustomBadgesStore, DiscordBadgeStore } from "src/Badges/stores";
import CustomBadgesSettingsGroup from "../CustomBadgesSettingsGroup";
import { CustomBadgeData } from "src/Badges/components/CustomBadge";
import { BadgeId } from '@discord/components';


export default function CustomDiscordBadgesSettingsGroup() {
  const users = CustomBadgesStore.useSelector(s => s.users);
  const badges = DiscordBadgeStore.useSelector(s => s);
  const items = Object
    .values(badges)
    .sort((a, b) => BadgePositionsStore.getBadgePosition(a.id) - BadgePositionsStore.getBadgePosition(b.id))
    .map<CustomBadgeData>(badge => ({
      id: badge.id,
      iconUrl: UrlUtils.DiscordEndpoints.BADGE_ICON(badge.icon),
      name: badge.description,
      href: badge.link,
      userTags: Object
        .entries(users)
        .map(([userId, badgeIds]) => badgeIds.includes(badge.id) && UserStore.getUser(userId))
        .filter(Boolean)
        .map(user => UserUtils.getDisplayName(user))
    }))

  return <CustomBadgesSettingsGroup
    items={items}
    onSearch={(search, badge) => [badge.name, badge.id, ...badge.userTags].some(value => value.toLowerCase().includes(search.toLowerCase()))}
    type='remove'
    onUserBadgesUpdate={(badge, userTag, state) => {
      const user = UserUtils.getUserByUsername(userTag);
      CustomBadgesStore.updateCustomUser(user.id, badge.id as BadgeId, state);
    }}
  />
}