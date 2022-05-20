import { ActivityIndexes, ActivityTypes, ChannelInputType, Guild, GuildMember, Snowflake, User } from "@discord";
import * as Discord from '@discord';

export type PatchReturns = {
    [Key in keyof PatchProps]: {
        args: [moduleProps: PatchProps[Key]],
        result: React.ReactElement
    }
} & {
    [key: string]: {
        args: [moduleProps: any],
        result: React.ReactElement
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

export type Message = {
    channel: Channel,
    compact: boolean,
    forceAddreactions: undefined,
    hasSpoilerEmbeds: boolean,
    isInteracting: boolean,
    message: Discord.Message,
    onAttachmentContextMenu: (e: Event, t: any) => any,
    renderComponentAccessory: undefined,
    renderSuppressEmbeds: undefined,
    renderThreadAccessory: undefined
}

export type Channel = {
    channel: Discord.Channel,
    chatInputType: ChannelInputType,
    guild: Guild,
    renderThreadNotice: boolean
}

export type UserPopout = {
    channelId: string,
    closePopout: () => void,
    guildId?: string,
    isPositioned: boolean,
    nudge: number,
    position: 'left' | 'right',
    setPopoutRef: (e: any) => void,
    updatePosition: () => void,
    userId: string
}