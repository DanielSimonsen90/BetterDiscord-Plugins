import { ActionsEmitter, createActionCallback } from "@actions";
import { DanhoStores, DiumStore } from "@stores";
import { BadgeId, UserProfileBadgeList, UserProfileBadge } from "@discord/components";

type State = Partial<Record<BadgeId | (string & {}), UserProfileBadge>>;

export const BadgeGroups = {
  discord: ['staff', 'partner', 'certified_moderator', 'automod'],
  bug_hunter: ['bug_hunter_level_2', 'bug_hunter_level_1'],
  hypesquad: ['hypesquad', 'hypesquad_house_1', 'hypesquad_house_2', 'hypesquad_house_3'],
  programming: ['verified_developer', 'active_developer', 'bot_commands'],
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

  public findBadgeByUrl(url: string, instance?: ReturnType<UserProfileBadgeList>['props']['children'][0]): UserProfileBadge | null {
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

  public getBadgeName(badgeId: BadgeId) {
    switch (badgeId) {
      case 'certified_moderator': return 'Moderator Programs Alumni';

      case 'bug_hunter_level_1': return 'Discord Bug Hunter';
      case 'bug_hunter_level_2': return 'Discord Bug Hunter';

      case 'bot_commands': return 'Supports Commands';

      case 'hypesquad': return 'HypeSquad Events';
      case 'hypesquad_house_1': return 'HypeSquad Bravery';
      case 'hypesquad_house_2': return 'HypeSquad Brilliance';
      case 'hypesquad_house_3': return 'HypeSquad Balance';

      case 'premium': return 'Discord Nitro';
      case 'premium_tenure_1_month_v2': return 'Nitro Bronze';
      case 'premium_tenure_3_month_v2': return 'Nitro Silver';
      case 'premium_tenure_6_month_v2': return 'Nitro Gold';
      case 'premium_tenure_12_month_v2': return 'Nitro Platinum';
      case 'premium_tenure_24_month_v2': return 'Nitro Diamond';
      case 'premium_tenure_36_month_v2': return 'Nitro Emerald';
      case 'premium_tenure_48_month_v2': return 'Nitro Sapphire'; // if it existed
      case 'premium_tenure_60_month_v2': return 'Nitro Ruby';
      case 'premium_tenure_72_month_v2': return 'Nitro Opal';

      case 'guild_booster_lvl1': return 'Server Booster';
      case 'guild_booster_lvl2': return 'Server Booster';
      case 'guild_booster_lvl3': return 'Server Booster';
      case 'guild_booster_lvl4': return 'Server Booster';
      case 'guild_booster_lvl5': return 'Server Booster';
      case 'guild_booster_lvl6': return 'Server Booster';
      case 'guild_booster_lvl7': return 'Server Booster';
      case 'guild_booster_lvl8': return 'Server Booster';
      case 'guild_booster_lvl9': return 'Server Booster';

      default: return badgeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
};

DanhoStores.register(DiscordBadgeStore);

export default DiscordBadgeStore;