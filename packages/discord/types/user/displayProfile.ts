import { Snowflake } from "../base";
import { User } from ".";
import { PremiumTypes } from "./premiumTypes";

export type DisplayProfile = Pick<User, 'accentColor' | 'banner' | 'bio' | 'pronouns'> & {
  guildId: Snowflake | undefined;
  popoutAnimationparticleType: null;
  profileEffectExpiresAt: undefined;
  profileEffectId: undefined;
  themeColors: [number, number];
  userId: Snowflake;
  _guildMemberProfile: null;
  _userProfile: User;

  get application(): null;
  get canEditThemes(): boolean;
  get canUsePremiumProfileCustomization(): boolean;
  get premiumGuildSince(): Date;
  get premiumSince(): Date;
  get premiumType(): PremiumTypes;
  get primaryColor(): number;

  getBadges?: () => any[];
  getBannerURL(): string;
  getLegacyUsername(): string;
  getPreviewBanner(): string;
  getPreviewBio(): string;
  getPreviewThemeColors(): [number, number];
  hasFullProfile(): boolean;
  hasPremiumCustomization(): boolean;
  hasThemeColors(): boolean;
  isUsingGuildMemberBanner(): boolean;
  isUsingGuildMemberBio(): boolean;
  isUsingGuildMemberPronouns(): boolean;
}
export default DisplayProfile;