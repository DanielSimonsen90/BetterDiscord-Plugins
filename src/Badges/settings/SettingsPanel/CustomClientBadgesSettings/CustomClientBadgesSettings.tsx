import React from "@react";
import { BadgePositionsStore, CustomBadgesStore } from "src/Badges/stores";
import CustomBadgesSettingsGroup from "../CustomBadgesSettingsGroup";

export default function CustomClientBadgesSettings() {
  return <CustomBadgesSettingsGroup
    items={CustomBadgesStore.customBadges}
    onSearch={(search, item) => [item.name, item.id, item.href].some(value => value?.toLowerCase().includes(search.toLowerCase()))}
    allowEdit 
    type="delete"
    onUserBadgesUpdate={(badge, userTag, state) => {
      badge.userTags = badge.userTags || [];
      if (state === 'add') badge.userTags.push(userTag);
      else badge.userTags = badge.userTags.filter(tag => tag !== userTag);

      CustomBadgesStore.upsertCustomBadge(badge);
    }}
    onRemoveOrDelete={badgeId => {
      BadgePositionsStore.deleteBadgePosition(badgeId);
      CustomBadgesStore.deleteCustomBadge(badgeId);
    }}
  />;
}