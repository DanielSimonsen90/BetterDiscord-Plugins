//@ts-nocheck

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