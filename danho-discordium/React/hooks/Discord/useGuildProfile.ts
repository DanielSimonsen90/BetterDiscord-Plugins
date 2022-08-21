import { Snowflake, User, GuildMember, PremiumTypes } from "@discord";
import { Finder } from "@discordium/api";
import { TransformType } from "danholibraryjs";

export interface UseGuildProfileModule {
    default(userId: Snowflake): TransformType<DisplayProfile, GuildMember, null>;
    default(userId: Snowflake, guildId: Snowflake): DisplayProfile;
    
    getDisplayProfile(userId: Snowflake): TransformType<DisplayProfile, GuildMember, null>;
    getDisplayProfile(userId: Snowflake, guildId?: Snowflake): DisplayProfile;
}
export const UseGuildProfileModule: UseGuildProfileModule = Finder.byProps("getDisplayProfile");
export default UseGuildProfileModule;

export const useGuildProfile = UseGuildProfileModule.default;
export const getDisplayProfile = UseGuildProfileModule.getDisplayProfile;

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
