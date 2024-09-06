import type { Snowflake } from "@discord/types/base";
import type { GuildMember } from "@discord/types/guild/member";
import type { User } from "@discord/types/user";
import type { PremiumTypes } from "@discord/types/user/premiumTypes";

import { Finder } from "@dium/api";
import type { TransformType } from "danholibraryjs";

export interface UseGuildProfileModule {
    default(userId: Snowflake): TransformType<DisplayProfile, GuildMember, null>;
    default(userId: Snowflake, guildId: Snowflake): DisplayProfile;
    
    getDisplayProfile(userId: Snowflake): TransformType<DisplayProfile, GuildMember, null>;
    getDisplayProfile(userId: Snowflake, guildId?: Snowflake): DisplayProfile;
}
// export const UseGuildProfileModule: UseGuildProfileModule = Finder.byKeys(["getDisplayProfile"]);
export default UseGuildProfileModule;

// export const useGuildProfile = UseGuildProfileModule.default;
// export const getDisplayProfile = UseGuildProfileModule.getDisplayProfile;

interface BonusProps {
    bio: string,
    emoji: null,
    popoutAnimationParticleType: undefined,
    themeColors: undefined,

    _guildMemberProfile: GuildMember,
    _userProfile: User,

    get canEditThemes(): boolean;
    get premiumGuildSince(): Date;
    get premiumSince(): Date;
    get premiumType(): PremiumTypes;
    get primaryColors(): number;

    getPreviewBanner(e, t, n): any;
    hasFullProfile(): boolean;
    isUsingGuildMemberBanner(): boolean;
    isUsingGuildMemberBio(): boolean;
}
type DisplayProfile = 
    Pick<User & GuildMember, 
    | 'accentColor' 
    | 'banner' 
    | 'getBannerURL' 
    | 'guildId' 
    | 'pronouns' 
    | 'userId'
    > & BonusProps
