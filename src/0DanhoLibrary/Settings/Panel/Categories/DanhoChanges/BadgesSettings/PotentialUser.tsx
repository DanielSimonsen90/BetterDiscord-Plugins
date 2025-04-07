import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  User as UserComponent,
  classNames,
} from "@react";

import { User } from "@discord/types";
import { Tooltip, UserProfileBadge } from "@discord/components";

import { UserProfileStore } from "@stores";
import { Logger } from "@danho-lib/dium/api/logger";
import { UrlUtils, UserUtils } from "@danho-lib/Utils";

import CustomBadgesStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/CustomBadgesStore";
import { CustomBadge, CustomBadgeData } from "src/0DanhoLibrary/features/danho-enhancements/badges/components/CustomBadge";
import { BadgePositionsStoreEditor } from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/BadgePositionsStore";
import DiscordBadgeStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/DiscordBadgeStore";

import { ModifyBadgeData } from "./CustomBadgeModifyForm";

type Props = {
  user: User;
  modifyBadge: ModifyBadgeData;

  selectedBadge: Partial<CustomBadgeData> | null;
  setModifyBadge: Dispatch<SetStateAction<ModifyBadgeData | null>>;

  badgePositionsStoreEditor: BadgePositionsStoreEditor;
  badgeIdsInTooltip?: boolean;
}

export const PotentialUser = (props: Props) => {
  const { 
    user, modifyBadge, 
    selectedBadge, setModifyBadge, 
    badgePositionsStoreEditor, 
    badgeIdsInTooltip 
  } = props;

  const [badgeIds, badges, customBadges] = useMemo(() => {
    const displayProfile = UserProfileStore.getUserProfile(user.id);
    const badges: Array<UserProfileBadge> = (
      displayProfile?.badges ??
      displayProfile?.getBadges() ??
      []
    );
    const addedBadges = CustomBadgesStore.current.users[user.id] ?? [];
    const customBadges = CustomBadgesStore.customBadges
      .filter(badge => badge.userTags?.includes(user.username));

    const badgeIds = [
      ...badges.map(badge => badge.id),
      ...addedBadges,
      ...customBadges.map(badge => badge.id),
    ];

    return [badgeIds, badges, customBadges];
  }, [user, modifyBadge, badgePositionsStoreEditor]);
  
  const compiledBadges = useMemo(() => {
    if (!badgeIds.includes(selectedBadge.id) || !badgeIds.includes(modifyBadge.id)) badgeIds.push(selectedBadge.id);
    return badgePositionsStoreEditor.sort(badgeIds).map<CustomBadgeData>(badgeId => {
      const badge = (
        badges.find(badge => badge.id === badgeId)
          || badgeId in DiscordBadgeStore.current ? DiscordBadgeStore.current[badgeId] : null
      );
      if (badge) return {
        id: badge.id,
        name: badgeIdsInTooltip ? badge.id : badge.description,
        iconUrl: UrlUtils.badgeIcon(badge.icon),
        href: badge.link,
      };

      if (badgeId === modifyBadge.id || badgeId === selectedBadge.id) return modifyBadge as CustomBadgeData;

      const customBadge = customBadges.find(badge => badge.id === badgeId);
      if (customBadge) return {
        ...customBadge,
        name: badgeIdsInTooltip ? customBadge.id : customBadge.name,
      };

      Logger.warn(`Badge ${badgeId} not found in DiscordBadgeStore or CustomBadgesStore`, {
        badges,
        modifyBadge,
      });
      return null;
    }).filter(Boolean) as CustomBadgeData[]
  }, [badges, modifyBadge, selectedBadge, badgeIds, customBadges, badgePositionsStoreEditor, badgeIdsInTooltip]);

  return (
    <Tooltip text={`Give ${modifyBadge.name} to ${UserUtils.getUsernames(user).shift()}`}>
      {props => (
        <div className='tooltip-inner' {...props}>
          <UserComponent user={user} 
            className={classNames(
              'potential-user',
              modifyBadge.userTags?.includes(user.username) && 'border-success'
            )} 
            onClick={() => setModifyBadge(current => ({ ...current, userTags: current.userTags ? [...current.userTags, user.username] : [user.username] }))}>
            <div className="danho-user-badge-list">
              {compiledBadges.map(badge => <CustomBadge key={badge.id} {...badge} />)}
            </div>
          </UserComponent>
        </div>
      )}
    </Tooltip>
  );
};