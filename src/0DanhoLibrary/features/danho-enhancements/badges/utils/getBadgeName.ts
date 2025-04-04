import { BadgeId } from "../stores/DiscordBadgeStore";

export function getBadgeName(badgeId: BadgeId) {
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