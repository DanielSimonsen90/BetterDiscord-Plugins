import { ActionsEmitter, createActionCallback } from "@actions";
import { DanhoStores, DiumStore } from "@stores";
import { BadgeList, UserProfileBadge } from "@discord/components";

export type BadgeId = (
  // Discord badges
  | 'staff' | 'certified_moderator' | 'partner' | 'automod'
  // Programming badges
  | 'active_developer' | 'verified_developer' | 'bot_commands'
  // Bug Hunter badges
  | 'bug_hunter_level_1' | 'bug_hunter_level_2'
  // Hypesquad badges
  | 'hypesquad' | 'hypesquad_house_1' | 'hypesquad_house_2' | 'hypesquad_house_3'
  // Nitro badges
  | 'premium' | `premium_tenure_${1 | 3 | 6 | 12 | 24 | 36 | 48 | 60 | 72}_month_v2` | 'early_supporter'
  // Server Boost badges
  | `guild_booster_lvl${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  // Other badges
  | 'legacy_username' | 'quest_completed'
);

type State = Partial<Record<BadgeId | (string & {}), UserProfileBadge>>;

export const BadgeGroups = {
  discord: ['staff', 'certified_moderator', 'partner', 'automod'],
  programming: ['active_developer', 'verified_developer', 'bot_commands'],
  bug_hunter: ['bug_hunter_level_1', 'bug_hunter_level_2'],
  hypesquad: ['hypesquad', 'hypesquad_house_1', 'hypesquad_house_2', 'hypesquad_house_3'],
  nitro: ['premium', 'premium_tenure_1_month_v2', 'premium_tenure_3_month_v2', 'premium_tenure_6_month_v2', 'premium_tenure_12_month_v2', 'premium_tenure_24_month_v2', 'premium_tenure_36_month_v2', 'premium_tenure_60_month_v2', 'premium_tenure_72_month_v2', 'early_supporter'],
  server_boost: ['guild_booster_lvl1', 'guild_booster_lvl2', 'guild_booster_lvl3', 'guild_booster_lvl4', 'guild_booster_lvl5', 'guild_booster_lvl6', 'guild_booster_lvl7', 'guild_booster_lvl8', 'guild_booster_lvl9'],
  other: ['legacy_username', 'quest_completed'],
} satisfies Record<string, Array<BadgeId>>;

export const DiscordBadgeStore = new class DiscordBadgeStore extends DiumStore<State> {
  constructor() {
    super({}, 'DiscordBadgeStore', () => {
      ActionsEmitter.on('USER_PROFILE_FETCH_SUCCESS', this.onUserProfileFetchSuccess.bind(this));
    });
  }

  protected onUserProfileFetchSuccess = createActionCallback('USER_PROFILE_FETCH_SUCCESS',
    ({ badges }) => {
      if (!badges?.length) return;

      const updates = badges.filter(badge => {
        const stored = this.current[badge.id];
        return !stored || stored.icon !== badge.icon;
      });

      if (updates.length) this.update(current => ({
        ...current,
        ...updates.reduce((acc, badge) => {
          acc[badge.id] = badge;
          return acc;
        }, {} as State)
      }));
    });

  public findBadgeByUrl(url: string, instance?: ReturnType<BadgeList>['props']['children'][0]): UserProfileBadge | null {
    if (!url && !instance) return null;
    let found = url ? Object.values(this.current).find(badge => url.includes(badge.icon)) : null;
    found ??= !instance || typeof instance.props.text === 'string' ? null : instance.props.text.props.profileBadge;

    if (found && !this.current[found.id]) this.update(current => ({
      ...current,
      [found.id]: found,
    }));

    return found;
  }

  private addBadge(badge: UserProfileBadge) {
    this.update(current => ({
      ...current,
      [badge.id]: badge,
    }));
  }
};

DanhoStores.register(DiscordBadgeStore);

export default DiscordBadgeStore;