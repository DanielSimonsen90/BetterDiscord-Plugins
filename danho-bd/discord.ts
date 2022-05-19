import { Item } from "./base";

export type Features = 
    'ANIMATED_ICON' | 
    'BANNER' |
    'COMMERCE' |
    'COMMUNITY' |
    'DISCOVERABLE' |
    'FEATURABLE' |
    'INVITE_SPLASH' |
    'MEMBER_VERIFICATION_GATE_ENABLED' |
    'NEWS' |
    'PARTNERED' |
    'PREVIEW_ENABLED' |
    'VANITY_URL' |
    'VERIFIED' |
    'VIP_REGIONS' |
    'WELCOME_SCREEN_ENABLED'
;

export const DiscordPermissionStrings = {
    ADD_REACTIONS: "Reactions",
    ADMINISTRATOR: "Admin",
    ATTACH_FILES: "Files",
    BAN_MEMBERS: "Ban",
    CHANGE_NICKNAME: "Nickname",
    CONNECT: "Connect",
    CREATE_INSTANT_INVITE: "Invite",
    DEAFEN_MEMBERS: "Deafen",
    EMBED_LINKS: "Embeds",
    KICK_MEMBERS: "Kick",
    MANAGE_CHANNELS: "Channels",
    // MANAGE_EMOJIS_AND_STICKERS: "Emojis/Stickers",
    MANAGE_GUILD_EXPRESSIONS: "Emojis/Stickers",
    MANAGE_GUILD: "Server",
    MANAGE_MESSAGES: "Messages",
    MANAGE_NICKNAMES: "Nicknames",
    MANAGE_ROLES: "Roles",
    MANAGE_WEBHOOKS: "Webhooks",
    MENTION_EVERYONE: "Mention",
    MOVE_MEMBERS: "Move",
    MUTE_MEMBERS: "Mute",
    PRIORITY_SPEAKER: "Priority",
    READ_MESSAGE_HISTORY: "History",
    SEND_MESSAGES: "Send",
    SEND_TTS_MESSAGES: "TTS",
    STREAM: "Stream/Video",
    SPEAK: "Speak",
    USE_EXTERNAL_EMOJIS: "External",
    USE_VAD: "VC Activity",
    VIEW_AUDIT_LOG: "Audit Log",
    VIEW_CHANNEL: "View",
    VIEW_GUILD_ANALYTICS: "Insights",
};

export type PermissionString = keyof typeof DiscordPermissionStrings;
export type UserStatus = "online" | "idle" | "dnd" | "invisible" | "offline";
export type GuildFolder = {
    folderColor: number,
    folderId: number,
    folderName: string,
    guildIds: Array<string>
}

type BaseActivityType<Type extends number> = {
    id: string,
    name: string,
    state: string,
    type: Type
}
type Assets = Partial<Record<`${'small' | 'large'}_${'image' | 'text'}`, string>>;
export type ActivityTypes = [
    /** Playing */
    Playing: BaseActivityType<0> & {
        application_id: string,
        assets: Assets,
        details: string,
        timestamps: { start: string },
    },
    /** Streaming */
    Streaming: BaseActivityType<1> & {
        assets: Assets,
        created_at: string,
        details: string,
        url: string,
    },
    /** Listening */
    Listening: BaseActivityType<2> & {
        assets: Assets,
        details: string,
        flags: number,
        metadata: {
            album_id: string,
            artist_ids: Array<string>,
            context_url: string,
        },
        party: { id: string },
        sync_id: string,
        timestamps: { start: number, end: number },
    },
    /** Watching */
    Watching: Omit<BaseActivityType<3>, 'state'> & {
        created_at: string
    },
    /** Custom */
    Custom: BaseActivityType<4> & {
        emoji?: Emoji,
        id: "custom",
    },
    /** Competing */
    Competing: BaseActivityType<5> & {
        application_id: string,
        assets: Assets,
        created_at: string,
        details: string,
        url: string,
    }
]
export type Attachment = {
    content_type: string,
    filename: string,
    height: number,
    id: string,
    proxy_url: string,
    size: number,
    spoiler: boolean,
    url: string,
    width: number,
}

export type ComponentTable = {

}
enum ButtonStyles {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
}
enum TextInputStyles {
    Short = 1,
    Paragraph = 2,
}
type ComponentTypes = [
    NA: null,
    ActionRow: {
        type: 1,
        components: Array<ComponentTypes>
    },
    Button: {
        type: 2,
        style: ButtonStyles,
        label?: string,
        emoji?: Emoji,
        custom_id?: string,
        url?: string,
        disabled?: boolean
    },
    SelectMenu: {
        type: 3,
        custom_id?: string,
        options: Array<{
            label: string,
            value: string,
            description?: string,
            emoji?: Emoji,
            default?: boolean,
        }>
        placeholder?: string,
        min_values?: number,
        max_values?: number,
        disabled?: boolean
    },
    TextInput: {
        type: 4,
        custom_id?: string,
        style: TextInputStyles,
        label: string,
        min_length?: number,
        max_length?: number,
        required?: boolean,
        value?: string,
        placeholder?: string,
    }
]
export type Guild = Item & {
    afkChannelId: string
    afkTimeout: number
    application_id: string
    banner: string
    defaultMessageNotifications: number
    description: string
    discoverySplash: string
    explicitContentFilter: number
    features: Set<Features>
    icon: string
    joinedAt: string
    maxMembers: number
    maxVideoChannelUsers: number
    mfaLevel: number
    ownerId: string
    preferredLocale: string
    premiumSubscriberCount: number
    premiumTier: number
    pdatesChannelId: string
    region: string
    roles: { [roleId: string]: Role }
    rulesChannelId: string
    splash: string
    systemChannelFlags: number
    systemChannelId: string
    vanityURLCode: string
    verificationLevel: number
}

export type GuildMember = Pick<User, 'avatar' | 'banner' | 'bio' | 'flags'> & {
    colorString: string,
    communicatinDisabledUntil?: string,
    fullProfileLoadedTimestamp: number,
    guildId: string,
    iconRoleId: string,
    isPending: boolean,
    joinedAt: string,
    nick?: string,
    premiumSince?: string,
    roles: Array<string>,
    userId: string,
}
export type Channel = Item & {
    application_id: string
    appliedTags: string[]
    availableTags: string[]
    bitrate: number
    defaultAutoArchivedDuration: number
    flags: number
    guild_id: string
    icon: string
    lastMessageId: string
    lastPinTimestamp: string
    member: any
    memberCount: number
    memberIdsPreview: any
    memberListId: string
    messagesCount: number
    nicks: {}
    nsfw: false
    originChannelId: string
    ownerId: string
    parent_id: string
    permissionOverwrites: PermissionOverwrite
    position: number
    rateLimitPerUser: number
    rawRecipients: []
    recipients: []
    rtcRegion: string
    threadMetadata: any
    topic: string
    type: number
    userLimit: number
    videoQualityMode: number
    get lastActiveTimestamp(): number
    get accessPermissions(): number
}
export type ChannelInputType = {
    analyticsName: string | 'normal',
    attachments: boolean,
    autocomplete: {
        addReactionShortcut: boolean,
        forceChatLayer: boolean,
        reactions: boolean,
    },
    commands: {
        enabled: boolean
    },
    drafts: {
        type: number,
        autoSave: boolean,
    },
    emojis: {
        button: boolean
    },
    gifs: {
        button: boolean,
        allowSending: boolean
    },
    gifts: {
        button: boolean,
    }
    permissions: {
        requireSendMessages: boolean,
    },
    sedReplace: boolean,
    showCharacterCount: boolean,
    showThreadPromptOnreply: boolean,
    stickers: {
        button: boolean,
        allowSending: boolean
        autoSuggest: boolean,
    },
    submit: {
        button: boolean,
        ignorePreference: boolean,
        disableEntertoSubmit: boolean,
        clearOnsubmit: boolean,
        useDisabledStylesOnSubmit: boolean,
    },
    uploadLongMessages: boolean,
    upsellLongMessages: boolean,
}
export type Embed = {
    color: string,
    fields: Array<{
        rawTitle: string,
        rawValue: string,
        inline: boolean,
    }>,
    footer: {
        iconProxyURL?: string,
        iconURL?: string,
        text: string
    }
    id: string,
    image?: {
        url: string,
        proxyURL: string,
        width: number,
        height: number,
    },
    provider?: {
        name: string,
        url?: string
    }
    rawDescription?: string,
    rawTitle: string,
    referenceId?: string,
    thumbnail?: {
        url: string,
        proxyURL: string,
        height: number,
        width: number,
    }
    type: string | 'rich' | 'article';
    timestamp?: Timestamp,
    url?: string,
}
export type Emoji = Item & {
    animated: boolean
}
export type Message = {
    activity?: any;
    application?: any;
    applicationId?: string;
    attachments: Array<Attachment>;
    author: User;
    blocked: boolean;
    bot: boolean;
    call?: any;
    channel_id: string;
    codedLinks: Array<any>;
    colorString?: string;
    components: Array<ComponentTypes>;
    content: string;
    customRenderedContent?: any;
    editedTimestamp?: number;
    embeds: Array<Embed>;
    flags: number;
    giftCodes: Array<string>;
    id: string;
    interaction?: {
        type: number,
        id: string,
        name: string,
        user: User
    };
    interactionData?: {
        application_command: {
            application_id: string,
            default_member_permissions?: number,
            default_permission: boolean,
            description: string,
            guild_id: string,
            id: string,
            name: string,
            options: Array<{
                type: number, 
                name: string,
                description: string,
                required: boolean,
            }>,
            type: number,
            version: string
        },
        guild_id: string,
        id: string,
        name: string,
        options: Array<{
            type: number,
            name: string,
            value: string
        }>,
        type: number 
    };
    interactionError?: any;
    isSearcHit: boolean;
    loggingName?: string;
    mentionChannels: Array<string>;
    mentionEveryone: boolean;
    mentionRoles: Array<string>;
    mentioned: boolean;
    mentions: Array<string>;
    messageReference?: {
        channel_id: string,
        message_id: string,
        guild_id: string,
    };
    nick?: string;
    nonce?: string;
    pinned: boolean;
    reactions: Array<MessageReaction>;
    state: string | 'SENT';
    stickerItems: Array<{
        format_type: number,
        id: string,
        name: string
    }>;
    stickers: Array<any>;
    timestamp: Timestamp;
    tts: boolean;
    type: number;
    webhookId?: string;
}
export type MessageReaction = {
    count: number,
    emoji: Emoji,
    me: boolean,
}
export type PermissionOverwrite = {
    allow: number
    deny: number
    id: string
    type: number
}
export type Role = Item & {
    color: number
    colorString: string;
    flags: number,
    hoist: boolean
    icon?: string
    managed: boolean
    mentionable: boolean
    originalPosition: number
    permissions: number
    position: number
    tags: {}
    unicodeEmoji?: string
}
export type Timestamp = {
    _d: Date,
    _i: Date,
    _isAMomentObject: boolean,
    _isUTC: boolean,
    _isValid: boolean,
    _locale: Locale,
    _pf: {
        charsLeftOver: number,
        empty: boolean,
        invalidFormat: boolean,
        invalidMonth?: boolean,
        iso: boolean,
        meridiem: boolean,
        nullInput: boolean,
        overflow: number,
        parsedDateParts: Array<number>,
        rfc2822: boolean,
        unusedInput: Array<string>,
        unusedTokens: Array<string>,
        userInvalidated: boolean,
        weekdaymismatch: boolean
    }
}
export enum PremiumTypes {
    User = 0,
    Classic = 1,
    Nitro = 2
}
export type User = Pick<Item, 'id'> & {
    accentColor?: number
    avatar: string
    avatarDeoration: null,
    banner?: string
    bio: string
    bot: boolean
    desktop: boolean
    discriminator: string
    email?: string
    flags: number
    guildMemberAvatars: { [guildId: string]: string | null }
    mfaEnabled: boolean
    mobile: boolean,
    nsfwAllowed?: boolean
    phone?: string
    premiumType?: PremiumTypes,
    premiumUsageFlags: number,
    pronouns: string,
    publicFlags: number,
    system: string
    username: string
    verified: boolean

    get createdAt(): Date
    get hasPremiumPerks(): boolean
    get tag(): string
    get usernameNormalized(): string
}
type Locale = {
    ordinal: (e: any) => any,
    _abbr: string,
    _calendar: Calendar,
    _config: LocaleConfig,
    _dayOfMonthOrdinalParseLenient: RegExp,
} & {
    [key in keyof LocaleConfig as `_${key}`]: LocaleConfig[key];
}
type Calendar = {
    lastDay: string,
    lastWeek: string,
    nextDay: string,
    nextWeek: string,
    sameDay: string,
    sameElse: string,
}
type LocaleConfig = {
    abbr: string,
    calendar: Calendar,
    dayOfMonthOrdinalParse: RegExp,
    invalidDate: string,
    longDateFormat: Record<'L' | 'LL' | 'LLL' | 'LLLL' | 'LT' | 'LTS', string>,
    meridiemParse: RegExp,
    months: Array<string>,
    monthsShort: Array<string>,
    ordinal: (e: any) => any,
    relativeTime: Record<'M' | 'MM' | 'd' | 'dd' | 'future' | 'h' | 'hh' | 'm' | 'mm' | 'past' | 's' | 'ss' | 'y' | 'yy', string>,
    week: Record<'dow' | 'doy', number>,
    weekdays: Array<string>,
    weekdaysMin: Array<string>,
    weekdaysShort: Array<string>,
}