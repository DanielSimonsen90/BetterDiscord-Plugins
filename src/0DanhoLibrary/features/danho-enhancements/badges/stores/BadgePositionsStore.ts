import { CSSProperties, useState, useCallback } from "@react";
import { Logger } from "@dium";
import { DanhoStores, DiumStore } from "@stores";
import { UrlUtils } from "@danho-lib/Utils";

import { Settings } from "src/0DanhoLibrary/Settings";

import DiscordBadgeStore, { BadgeId } from "./DiscordBadgeStore";
import CustomBadgesStore from "./CustomBadgesStore";

type Store = {
  [key: string | BadgeId]: number;
};

type BasicProfileBadge = {
  id: string;
  name: string;
  iconUrl: string;
  url: string;
  style?: CSSProperties;
};

export type BadgePositionsStoreEditor = ReturnType<typeof BadgePositionsStore.useEditorStore>

export const BadgePositionsStore = new class BadgePositionsStore extends DiumStore<Store> {
  constructor(defaultState = {}) {
    super(defaultState, "BadgePositionsStore");
  }

  public getSortedBadgeIds() {
    return Object.entries(this.current)
      .sort(([, a], [, b]) => a - b)
      .map(([badgeId]) => badgeId);
  }
  public getSortedBadges() {
    return this.getSortedBadgeIds()
      .map(badgeId => this.getBadge(badgeId));
  }
  public getBadgePosition(badgeId: string | BadgeId) {
    return this.current[badgeId] ?? -1;
  }

  public setBadgePosition(badgeId: string | BadgeId, position: number) {
    const ids = this.getSortedBadgeIds();
    ids.splice(position, 0, badgeId as string | BadgeId);
    this.update(ids.reduce((acc, id, index) => {
      acc[id] = index;
      return acc;
    }, {} as Store));
  }

  public sort(badgeIds: Array<string | BadgeId>): string[] {
    const sortedBadgeIds = this.getSortedBadgeIds();
    const positions = this.current;

    return badgeIds.sort((a, b) => {
      const aIndex = sortedBadgeIds.indexOf(a as string | BadgeId);
      const bIndex = sortedBadgeIds.indexOf(b as string | BadgeId);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return positions[a] - positions[b];
    });
  }

  public useEditorStore() {
    const [sortedBadgeIds, setSortedBadgeIds] = useState(this.getSortedBadgeIds());
    const getDefaultStoreState = useCallback(() => {
      return sortedBadgeIds.reduce((acc, badgeId) => {
        acc[badgeId] = this.getBadgePosition(badgeId);
        return acc;
      }, {} as Store);
    }, [sortedBadgeIds]);
    const editorStore = new BadgePositionsStore(getDefaultStoreState())

    return {
      sort: (badgeIds) => editorStore.sort(badgeIds),
      getSortedBadges: () => sortedBadgeIds.map(badgeId => editorStore.getBadge(badgeId)),
      setBadgePosition: (badgeId: string | BadgeId, position: number) => {
        const ids = sortedBadgeIds.slice();
        ids.splice(position, 0, badgeId as string | BadgeId);
        setSortedBadgeIds(ids);
      }

    } satisfies Partial<BadgePositionsStore>
  }

  private getBadge(badgeId: string | BadgeId): BasicProfileBadge {
    const discordBadge = DiscordBadgeStore.current[badgeId as BadgeId];
    const customBadge = CustomBadgesStore.current?.customBadges?.[badgeId as string];

    if (!discordBadge && !customBadge) {
      Logger.warn(`Failed to find badge in DiscordBadgesStore`, badgeId);
      return null;
    }

    return {
      id: badgeId,
      name: discordBadge?.description ?? customBadge.name,
      iconUrl: discordBadge?.icon ? UrlUtils.badgeIcon(discordBadge.icon) : customBadge.iconUrl,
      url: discordBadge?.link ?? customBadge?.href,
      style: customBadge?.size ? {
        width: customBadge.size,
        height: customBadge.size,
      } : undefined
    };
  }

  private getDiscordBadgesPositions = () => [
    ...(Settings.current.movePremiumBadge ? [] : NitroBadges),
    'staff',
    'partner',
    'certified_moderator',
    'automod',
    'hypesquad',
    'bug_hunter_level_2',
    'bug_hunter_level_1',
    'hypesquad_house_3',
    'hypesquad_house_2',
    'hypesquad_house_1',
    'verified_developer',
    'active_developer',
    'bot_commands',
    ...(Settings.current.movePremiumBadge ? NitroBadges : []),
    'early_supporter',
    'guild_booster_lvl9',
    'guild_booster_lvl8',
    'guild_booster_lvl7',
    'guild_booster_lvl6',
    'guild_booster_lvl5',
    'guild_booster_lvl4',
    'guild_booster_lvl3',
    'guild_booster_lvl2',
    'guild_booster_lvl1',
    'legacy_username',
    'quest_completed',
  ] as Array<BadgeId>;
};

DanhoStores.register(BadgePositionsStore);
export default BadgePositionsStore;

const NitroBadges = [
  'premium_tenure_72_month_v2',
  'premium_tenure_60_month_v2',
  'premium_tenure_48_month_v2',
  'premium_tenure_36_month_v2',
  'premium_tenure_24_month_v2',
  'premium_tenure_12_month_v2',
  'premium_tenure_6_month_v2',
  'premium_tenure_3_month_v2',
  'premium_tenure_1_month_v2',
  'premium',
] as Array<BadgeId>;