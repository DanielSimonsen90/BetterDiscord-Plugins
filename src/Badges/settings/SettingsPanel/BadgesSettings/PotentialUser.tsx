import React, {
  useMemo,
  Dispatch, SetStateAction,
  classNames,
} from "@react";
import { UserListItem } from "@components";

import { User } from "@discord/types";
import { Tooltip, UserProfileBadge } from "@discord/components";
import { UserProfileStore } from "@discord/stores";

import { Logger } from "@injections";
import { UrlUtils, UserUtils } from "@utils";

import { CustomBadge, CustomBadgeData } from "../../../components/CustomBadge";
import { BadgePositionsStoreEditor, CustomBadgesStore, DiscordBadgeStore } from "../../../stores";

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
        iconUrl: UrlUtils.DiscordEndpoints.BADGE_ICON(badge.icon),
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
          <UserListItem user={user} 
            className={classNames(
              'potential-user',
              modifyBadge.userTags?.includes(user.username) && 'border-success'
            )} 
            onClick={() => setModifyBadge(current => ({ ...current, userTags: current.userTags ? [...current.userTags, user.username] : [user.username] }))}>
            <div className="danho-user-badge-list">
              {compiledBadges.map(badge => <CustomBadge key={badge.id} {...badge} />)}
            </div>
          </UserListItem>
        </div>
      )}
    </Tooltip>
  );
};