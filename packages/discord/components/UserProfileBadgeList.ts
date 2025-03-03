import Finder from "@danho-lib/dium/api/finder";
import { DisplayProfile } from "@discord/types";

export type BadgeList = JSX.BD.FC<{
  badges: Array<UserProfileBadge>;
  displayProfile?: DisplayProfile;
  onClose: (e: React.MouseEvent) => void;
}, {
  'aria-label': 'User Badges';
  children: Array<JSX.BD.Rendered<{
    'aria-label': string;
    children: JSX.BD.Rendered<{
      children: [
        badgeIcon: JSX.BD.Rendered<{
          alt: ' ';
          'aria-hidden': true;
          className: 'badge_...';
          src: string;
        }, 'img'>,
        false
      ];
      href?: string;
      onClick: (event: MouseEvent) => void;
      onMouseEnter: () => void;
    }, true>;
    delay: 300;
    onTooltipHide: () => void;
    onTooltipShow: () => void;
    text: string | JSX.BD.Rendered<any>;
    tooltipClassName: undefined;
  }, true>>;
  className: 'container_...';
  role: 'group';
}>;

export const BadgeList: Record<'Z', BadgeList> = Finder.findBySourceStrings("badges", "badgeClassName", "displayProfile", "QUEST_CONTENT_VIEWED", { defaultExport: false });
export default BadgeList;

export type UserProfileBadge = {
  id: string;
  description: string;
  icon: string;
  link: string;
};

export enum BadgeTypes {
  NITRO_ANY = 'premium',
  NITRO_BRONZE = 'premium_tenure_1_month',
  NITRO_SILVER = 'premium_tenure_3_month',
  NITRO_GOLD = 'premium_tenure_6_month',
  NITRO_PLATINUM = 'premium_tenure_12_month',
  NITRO_DIAMOND = 'premium_tenure_24_month',
  NITRO_EMERALD = 'premium_tenure_36_month',
  NITRO_RUBY = 'premium_tenure_60_month',
  NITRO_FIRE = 'premium_tenure_72_month',

  GUILD_BOOST_ANY = 'booster',
  GUILD_BOOST_1 = 'guild_booster_lvl1',
  GUILD_BOOST_2 = 'guild_booster_lvl2',
  GUILD_BOOST_3 = 'guild_booster_lvl3',
  GUILD_BOOST_4 = 'guild_booster_lvl4',
  GUILD_BOOST_5 = 'guild_booster_lvl5',
  GUILD_BOOST_6 = 'guild_booster_lvl6',
  GUILD_BOOST_7 = 'guild_booster_lvl7',
  GUILD_BOOST_8 = 'guild_booster_lvl8',
  GUILD_BOOST_9 = 'guild_booster_lvl9',

  EARLY_SUPPORTER = 'early_supporter',

  HYPESQUAD_EVENTS = 'hypesquad',
  HYPESQUAD_BRAVERY = 'hypesquad_house_1',
  HYPESQUAD_BRILLIANCE = 'hypesquad_house_2',
  HYPESQUAD_BALANCE = 'hypesquad_house_3',

  ACTIVE_DEVELOPER = 'active_developer',
  SLASH_COMMANDS = 'bot_commands',
  EARLY_VERIFIED_DEVELOPER = 'verified_developer',
  BUG_HUNTER_GREEN = 'bug_hunter_level_1',
  BUG_HUNTER_GOLD = 'bug_hunter_level_2',

  STAFF = 'staff',
  MODERATOR = 'certified_moderator',
  PARTNER = 'partner',
  AUTO_MOD = 'automod',

  QUEST = 'quest_completed',
  LEGACY_USERNAME = 'legacy_username',
}

export enum BadgeIconIds {
  active_developer = "6bdc42827a38498929a4920da12695d9",
  automod = "f2459b691ac7453ed6039bbcfaccbfcd",
  bot_commands = "6f9e37f9029ff57aef81db857890005e",
  bug_hunter_lvl1 = "2717692c7dca7289b35297368a940dd0",
  bug_hunter_lvl2 = "848f79194d4be5ff5f81505cbd0ce1e6",
  certified_moderator = "fee1624003e2fee35cb398e125dc479b",
  guild_booster_lvl1 = "51040c70d4f20a921ad6674ff86fc95c",
  guild_booster_lvl2 = "0e4080d1d333bc7ad29ef6528b6f2fb7",
  guild_booster_lvl3 = "72bed924410c304dbe3d00a6e593ff59",
  guild_booster_lvl4 = "df199d2050d3ed4ebf84d64ae83989f8",
  guild_booster_lvl5 = "996b3e870e8a22ce519b3a50e6bdd52f",
  guild_booster_lvl6 = "991c9f39ee33d7537d9f408c3e53141e",
  guild_booster_lvl7 = "cb3ae83c15e970e8f3d410bc62cb8b99",
  guild_booster_lvl8 = "7142225d31238f6387d9f09efaa02759",
  guild_booster_lvl9 = "ec92202290b48d0879b7413d2dde3bab",
  hypesquad = "bf01d1073931f921909045f3a39fd264",
  hypesquad_house_1 = "8a88d63823d8a71cd5e390baa45efa02",
  hypesquad_house_2 = "011940fd013da3f7fb926e4a1cd2e618",
  hypesquad_house_3 = "3aa41de486fa12454c3761e8e223442e",
  legacy_username = "6de6d34650760ba5551a79732e98ed60",
  partner = "3f9748e53446a137a052f3454e2de41e",
  premium = "2ba85e8026a8614b640c2837bcdfe21b",
  premium_tenure_12_month_v2 = "0334688279c8359120922938dcb1d6f8",
  premium_early_supporter = "7060786766c9c840eb3019e725d2b358",
  quest_completed = "7d9ae358c8c5e118768335dbe68b4fb8",
  staff = "5e74e9b61934fc1f67c65515d1f7e60d",
  verified_developer = "6df5892e0f35b051f8b61eace34f4967"
}

export function getBadgeIconUrl(badgeKey: keyof BadgeTypes | keyof BadgeIconIds) {
  return `https://cdn.discordapp.com/badge-icons/${BadgeIconIds[badgeKey]}.png`;
}