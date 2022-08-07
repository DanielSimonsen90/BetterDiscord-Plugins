import { User } from "@discord";
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
export enum ActivityIndexes {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
} 
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

export type BaseComponent<Type extends number> = {
    type: Type
    [key: string]: any
}
export type ActionRow = BaseComponent<1> & {
    components: Array<BaseComponent<number>>
}
export type Button = BaseComponent<2> & {
    style: ButtonStyles,
    label?: string,
    emoji?: Emoji,
    custom_id?: string,
    url?: string,
    disabled?: boolean
}
export type SelectMenu = BaseComponent<3> & {
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
}
export type TextInput = BaseComponent<4> & {
    custom_id?: string,
    style: TextInputStyles,
    label: string,
    value: string,
    min_length?: number,
    max_length?: number,
    required?: boolean,
    placeholder?: string,
}

export type ComponentTypes = {
    1: ActionRow,
    2: Button,
    3: SelectMenu,
    4: TextInput,
    [number: number]: BaseComponent<number>
}
export enum Components {
    ActionRow = 1,
    Button,
    SelectMenu,
    TextInput,
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

export type MessageReaction = {
    count: number,
    emoji: Emoji,
    me: boolean,
}

export const enum MessageType {
    Default = 0,
    RecipientAdd = 1,
    RecipientRemove = 2,
    Call = 3,
    ChannelNameChange = 4,
    ChannelIconChange = 5,
    ChannelPinnedMessage = 6,
    UserJoin = 7,
    UserPremiumGuildSubscription = 8,
    UserPremiumGuildSubscriptionTier1 = 9,
    UserPremiumGuildSubscriptionTier2 = 10,
    UserPremiumGuildSubscriptionTier3 = 11,
    ChannelFollowAdd = 12,
    GuildStream = 13,
    GuildDiscoveryDisqualified = 14,
    GuildDiscoveryRequalified = 15,
    GuildDiscoveryGracePeriodInitialWarning = 16,
    GuildDiscoveryGracePeriodFinalWarning = 17,
    ThreadCreated = 18,
    Reply = 19,
    ChatInputCommand = 20,
    ThreadStarterMessage = 21,
    GuildInviteReminder = 22,
    ContextMenuCommand = 23
}

export const enum MessageState {
    Sending = "SENDING",
    SendFailed = "SEND_FAILED",
    Sent = "SENT"
}

export const enum MessageFlags {
    None = 0,
    Crossposted = 1,
    IsCrosspost = 2,
    SuppressEmbeds = 4,
    SourceMessageDeleted = 8,
    Urgent = 16,
    HasThread = 32,
    Ephemeral = 64,
    Loading = 128,
    FailedToMentionSomeRolesInThread = 256
}
type Snowflake = string;

export type Message = {
    type: MessageType;
    author: User;
    content: string;

    timestamp: import("moment").Moment;
    editedTimestamp?: any;
    state: MessageState;

    /** Message ID of parent. */
    nonce?: Snowflake;

    flags: MessageFlags;
    attachments: any[];
    codedLinks: any[];
    components: any[];
    embeds: any[];
    giftCodes: any[];
    mentionChannels: any[];
    mentionEveryone: boolean;
    mentionRoles: any[];
    mentioned: boolean;
    mentions: any[];
    messageReference?: any;
    reactions: any[];
    stickerItems: any[];
    stickers: any[];

    activity?: any;
    application?: any;
    applicationId?: any;
    blocked: boolean;
    bot: boolean;
    call?: any;
    colorString?: any;
    customRenderedContent?: any;
    id: Snowflake;
    interaction?: any;
    interactionData?: any;
    interactionError?: any;
    isSearchHit: boolean;
    loggingName?: any;
    nick?: any;
    pinned: boolean;
    tts: boolean;
    webhookId?: any;

    addReaction(arg1: any, arg2: any): void;
    getChannelId(): Snowflake;
    getReaction(arg: any): any;
    hasFlag(flag: MessageFlags): boolean;
    isCommandType(): boolean;
    isEdited(): boolean;
    isSystemDM(): boolean;
    removeReaction(arg1: any, arg2: any): void;
    removeReactionsForEmoji(arg: any): void;
    toJS(): any;
}
export type PermissionOverwrite = {
    allow: number
    deny: number
    id: string
    type: number
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