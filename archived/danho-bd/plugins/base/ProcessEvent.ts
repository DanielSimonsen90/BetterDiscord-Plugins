// @ts-nocheck
import { BaseProps, ComponentInstance, ComponentFiber } from '@lib/React';
import { MethodNames, PatchTypes } from '@BDFDB';
import { ActivityTypes, Channel, Guild, GuildMember, User, UserStatus } from '@discord';
import { Component } from '@react';

export type Modules =
    | 'Shakeable'
    | 'PrivateChannel'
    | 'AnalyticsContext'
    | 'PeopleListItem'
    | 'TabBar'
    | 'FriendRow'
    | 'DiscodTag'
    | 'Guilds'
    | 'GuildItem'
    | 'PeopleList'
    | 'PeopleListSectionedLazy'
    | 'NameTag'
    | 'ChannelCategoryItem'
    | 'ChannelTextAreaContainer'
    | 'ChannelEditorContainer'
    | 'MemberListItem'
    | 'Channels'
    | 'ChanneltextAreaForm'
    | 'Message'
    | 'MessageHeader'
    | 'MessageUsername'
    | 'MessageTimestamp'
    | 'LazyImageZoomable'
    | 'LazyImage'
    | 'Embed'
    | 'SystemMessage'
    | 'MessageToolbar'
    | 'UserPopoutContainer'
    | 'UserBanner'
    | 'UserPopoutInfo'
    | 'UserProfileModal'
    | 'UserProfileModalHeader'
    | 'UserProfileBadgeList'
    | 'SettingsView'
    | 'UseCopyIdItem'
    | 'StandardSidebarView'
;

export type ComponentPatcherInstance<Props> = Omit<ComponentInstance<Props>, 'key' | 'type' | 'ref'> & {
    context: {},
    getContext(): any,
    getLocation(): string,
    mergeLocation(): void,
    refs: {},
    state: null,
    updater: {
        enqueueForceUpdate(e: any, t: any): void,
        enqueueReplaceState(e: any, t: any, n: any): void,
        enqueueSetState(e: any, t: any, n: any): void,
        isMounted(e: any): boolean
    },
    _loadDate: null,
    _loadId: null,
    _reactInternals: ComponentFiber<Props, null>
}
export type ProcessEvent<Props = BaseProps> = {
    arguments: Array<Props>
    returnvalue: ComponentInstance<Props>;
    instance: ComponentPatcherInstance<Props>,
    component: Component<Props>,
    methodname: MethodNames,
    patchtypes: Array<PatchTypes>
}
export default ProcessEvent;
export type ProcessMethods = Record<`process${Modules}`, (e: any) => any>;

export type UserProfileBadgeList = ProcessEvent<{
    className: string,
    openPremiumSettings: () => void,
    premiumGuildSince: Date,
    premiumSince: Date,
    size: number,
    user: User
}>

export type MemberListItem = ProcessEvent<{
    activities: Array<ActivityTypes[keyof ActivityTypes]>,
    applicationStream: any,
    "aria-controls": string,
    "aria-expanded": boolean,
    channel: Channel,
    colorString: string,
    guildId: string,
    isMobile: boolean,
    isOwner: boolean,
    isTyping: boolean,
    itemProps: {
        "data-list-item-id": string,
        index: number,
        onFocus(): void,
        role: "listitem",
        tabIndex: number
    },
    nick: string,
    onClick(e: MouseEvent): void,
    onClickPremiumGuildIcon(e: MouseEvent): void,
    onContextMenu(e: MouseEvent): void,
    onKeyDown(e: KeyboardEvent): void,
    onMouseDown(e: MouseEvent): void,
    premiumSince: number,
    selected: boolean,
    shouldAnimateStatus: boolean,
    status: string,
    user: User    
}> & {
    instance: {
        context: {},
        handleMouseEnter(e: MouseEvent): void,
        handleMouseLeave(e: MouseEvent): void,
        refs: {},
        state: { hovered: boolean },
        updater: {
            enqueueForceUpdate(e: any, t: any): void,
            enqueueReplaceState(e: any, t: any, n: any): void,
            enqueueSetState(e: any, t: any, n: any): void,
            isMounted(e: any): boolean,
        }
    },
    component: {
        renderActivity(): Component,
        renderAvatar(): Component,
        renderBot(): Component,
        renderDecoration(): Component,
        renderOwner(): Component,
        renderPremium(): Component
    },
    returnvalue: {
        props: {
            "aria-posinset": number,
            "aria-setsize": number,
            avatar: ComponentInstance<{
                "aria-label": string,
                isMobile: boolean,
                isTyping: boolean,
                size: string,
                src: string,
                status: string,
                statusTooltip: boolean
            }>,
            className: string,
            decorators: ComponentInstance,
            focusProps: {
                offset: {
                    top: number,
                    left: number,
                    bottom: number,
                    right: number,                    
                }
            },
            id: string,
            name: ComponentInstance<{
                style: {
                    color: string,
                }
            }>,
            onFocus(): void,
            onMouseEnter(): void,
            onMouseLeave(): void,
            subText: ComponentInstance<{
                activities: Array<ActivityTypes[keyof ActivityTypes]>,
                animate: boolean,
                applicationStream: any,
                className: string,
                emojiClassName: string,
                hideEmoji: boolean,
                hideTooltip: boolean,
                textClassName: string,
            }>,
        }
    }
}

export type AnalyticsContext = Omit<ProcessEvent<{
    section: string,
    root: boolean,
    children: ComponentInstance<{
        "aria-label": string,
        children: [
            /** User Popout Header */
            ComponentInstance<{
                className: string,
                children: ComponentInstance<{
                    bannerType: number,
                    guildId: string,
                    onClose(): void,
                    user: User
                }>
            }>,

            /** User Avatar */
            ComponentInstance<{
                disableUserProfileLink: boolean,
                guildId: string,
                isMobile: boolean,
                onClose(): void,
                status: UserStatus,
                user: User
            }>,

            /** User Popout Info */
            UserPopoutInfo["instance"]["props"],

            /** User Popout: User & Guild Related */
            Omit<ComponentInstance<{
                className: string,
                onScroll(): void,
                children: [
                    ComponentInstance<{
                        customStatus: ComponentInstance<{
                            customStatusActivity: ActivityTypes[4],
                        }>,
                        guild: Guild,
                        hidePersonalInformation: boolean,
                        user: User
                    }>,
                    ComponentInstance<{
                        activity: ActivityTypes[keyof ActivityTypes],
                        canDM: boolean,
                        channelId: string,
                        customStatusActivity: ActivityTypes[4],
                        guild: Guild,
                        guildMember: GuildMember,
                        hidePersonalInformation: boolean,
                        onClose(): void,
                        setNote: undefined,
                        user: User
                    }>
                ]
            }>, 'ref'> & {
                ref: {
                    current: {
                        getScrollerNode(): Node,
                        getScrollerState(): any,
                        isScrolledToBottom(): boolean,
                        isScrolledToTop(): boolean,
                        mergeTo(e: any): void,
                        scrollIntoViewNode(t: any): void,
                        scrollIntoViewRect(e: any): void,
                        scrollPageDown(e: any): void,
                        scrollPageUp(e: any): void,
                        scrollTo(e: any): void,
                        scrollToBottom(e: any): void,
                        scrollToTop(e: any): void,
                        spring: {
                            abort(): void,
                            accumulator: number,
                            animating: boolean,
                            callback(n: any, r: any): void,
                            callbacks: Array<(n: any, r: any) => void>,
                            clamp: boolean,
                            friction: number,
                            from: number,
                            getNodeWindow(): Window,
                            last: null,
                            mass: number
                            maxVelocity: NumberConstructor["POSITIVE_INFINITY"],
                            mergeTo(e: any): void,
                            nextTick: number,
                            nodeWindow: null,
                            target: number,
                            tension: number,
                            threshold: number,
                            update(e: any): void,
                            vel: number
                        }
                    }
                }
            },

            /** User Popout: User Related */
            ComponentInstance<{
                canDM: boolean,
                onClose(): void,
                setNote: undefined,
                user: User
            }>
        ],
        className: string,
        onClick(e: MouseEvent): void,
        onContextMenu(e: MouseEvent): void,
        style: {
            width: number,
        }
    }>
}>, 'returrnvalue'> & {
    returnvalue: ComponentInstance<{
        children: ComponentInstance<{ className: string }>,
        root: boolean,
        section: string
    }>
}

export type UserPopoutInfo = ProcessEvent<{
    className: string,
    children: [
        ComponentInstance<UserProfileBadgeList["returnvalue"]["props"]>,
        ComponentInstance<{ 
            className: string,
            children: [
                null,
                // HeaderUsernameTag below Profile picture and BadgeList
                ComponentInstance<{
                    botClass: string,
                    className: string,
                    discriminatorClass: string,
                    hideDiscriminator: boolean,
                    user: User,
                    usernameClass: string,
                    usernameIcon: false
                }>,
                // BDFDB JoinedAt plugin
                ComponentInstance<{}>,
                // BDFDB CreatedAt plugin
                ComponentInstance<{
                    children: string,
                    className: string,
                    initiated: boolean,
                }>,
            ]
        }>
    ]
}>