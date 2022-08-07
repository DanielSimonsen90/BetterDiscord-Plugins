import { ActivityIndexes, ActivityTypes, Guild, GuildMember, Message, Snowflake, User } from "@discord";
import UserPopoutBody from "./UserPopoutBody";
import UserProfileBadgeList from "./UserProfileBadgeList";
import UserBio from "./UserBio";

export type PatchReturns = {
    [Key in keyof PatchProps]: {
        context: any,
        cancel: () => void,
        original: OriginalType[Key],
        args: PatchProps[Key] extends Array<any> ? PatchProps[Key] : [moduleProps: PatchProps[Key]],
        result: React.ReactElement<ResultProps[Key]>
    }
} & {
    [key: string]: {
        cancel: () => void;
        original: React.FunctionComponent,
        context: any;
        args: [moduleProps: any],
        result: React.ReactElement<any> 
    }
}
export type PatchProps = {
    UserProfileBadgeList: {
        className: string,
        openPremiumSettings(): void,
        premiumGuildSince: Date,
        premiumSince: Date,
        size: number,
        user: User,
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
    },
    Message: [
        messageId: string,
        props: {
            content: string,
            invalidEmojis: Array<string>,
            tts: boolean,
            validNonShortcutEmojis: Array<string>,
        },
        arg3: undefined,
        arg4: {}
    ],
    UserBio: {
        className: string,
        userBio: string
    }
}
export type OriginalType = {
    [Key in keyof PatchProps]: (...args: any[]) => any
}
export type ResultProps = {
    UserProfileBadgeList: UserProfileBadgeList
    UserPopoutBody: UserPopoutBody,
    Message: Message,
    UserBio: UserBio
}