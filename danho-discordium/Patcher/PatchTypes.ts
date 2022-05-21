import { ActivityIndexes, ActivityTypes, ChannelInputType, Guild, GuildMember, Snowflake, User } from "@discord";
import { UserPopoutBody } from "./UserPopoutBody";
import UserProfileBadgeList from "./UserProfileBadgeList";

export type PatchReturns = {
    [Key in keyof PatchProps]: {
        args: [moduleProps: PatchProps[Key]],
        result: React.ReactElement<ResultProps[Key]>
    }
} & {
    [key: string]: {
        args: [moduleProps: any],
        result: Element
    }
}
export type PatchProps = {
    UserProfileBadgeList: {
        className: string,
        openPremiumSettings(): void,
        premiumGuildSince: Date,
        premiumSince: Date,
        size: number,
        user: User
    },
    UserPopoutBody: {
        activity: ActivityTypes[number],
        canDM: boolean,
        channelId: Snowflake,
        customStatusActivity: ActivityTypes[ActivityIndexes.CUSTOM],
        guild: Guild,
        guildMember: GuildMember,
        hidePersonalInformation: boolean,
        onClose: () => void,
        setNote: undefined,
        user: User
    }
}
export type ResultProps = {
    UserProfileBadgeList: UserProfileBadgeList
    UserPopoutBody: UserPopoutBody
}