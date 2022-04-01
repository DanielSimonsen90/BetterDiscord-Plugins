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

export class Guild extends Item {
    constructor(guild: any) {
        super(guild);

        this.afkChannelId = guild.afkChannelId;
        this.afkTimeout = guild.afkTimeout;
        this.application_id = guild.application_id;
        this.banner = guild.banner;
        this.defaultMessageNotifications = guild.defaultMessageNotifications;
        this.description = guild.description;
        this.discoverySplash = guild.discoverySplash;
        this.explicitContentFilter = guild.explicitContentFilter;
        this.features = guild.features;
        this.icon = guild.icon;
        this.joinedAt = guild.joinedAt;
        this.maxMembers = guild.maxMembers;
        this.maxVideoChannelUsers = guild.maxVideoChannelUsers;
        this.mfaLevel = guild.mfaLevel;
        this.ownerId = guild.ownerId;
        this.preferredLocale = guild.preferredLocale
        this.premiumSubscriberCount = guild.premiumSubscriberCount;
        this.premiumTier = guild.premiumTier;
        this.publicUpdatesChannelId = guild.publicUpdatesChannelId;
        this.region = guild.region;
        this.roles = guild.roles;
        this.rulesChannelId = guild.rulesChannelId;
        this.splash = guild.splash;
        this.systemChannelFlags = guild.systemChannelFlags;
        this.systemChannelId = guild.systemChannelId;
        this.vanityURLCode = guild.vanityURLCode;
        this.verificationLevel = guild.verificationLevel;
    }

    public afkChannelId: string
    public afkTimeout: number
    public application_id: string
    public banner: string
    public defaultMessageNotifications: number
    public description: string
    public discoverySplash: string
    public explicitContentFilter: number
    public features: Set<Features>
    public icon: string
    public joinedAt: string
    public maxMembers: number
    public maxVideoChannelUsers: number
    public mfaLevel: number
    public ownerId: string
    public preferredLocale: string
    public premiumSubscriberCount: number
    public premiumTier: number
    public publicUpdatesChannelId: string
    public region: string
    public roles: {}
    public rulesChannelId: string
    public splash: string
    public systemChannelFlags: number
    public systemChannelId: string
    public vanityURLCode: string
    public verificationLevel: number
}

export type GuildMember = Pick<User, 'avatar' | 'banner' | 'bio'> & {
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
export class Role extends Item {
    constructor(role: any) {
        super(role);

        this.color = role.color;
        this.colorString = role.colorString;
        this.hoist = role.hoist;
        this.icon = role.icon;
        this.managed = role.managed;
        this.mentionable = role.mentionable;
        this.originalPosition = role.originalPosition;
        this.permissions = role.permissions;
        this.position = role.position;
        this.tags = role.tags;
        this.unicodeEmoji = role.unicodeEmoji;
    }

    public color: number
    public colorString: string;
    public hoist: boolean
    public icon: string
    public managed: boolean
    public mentionable: boolean
    public originalPosition: number
    public permissions: number
    public position: number
    public tags: {}
    public unicodeEmoji?: string
}
export class Channel extends Item {
    constructor(channel: any) {
        super(channel);

        this.channel = channel;
        this.application_id = channel.application_id;
        this.appliedTags = channel.appliedTags;
        this.availableTags = channel.availableTags;
        this.bitrate = channel.bitrate;
        this.defaultAutoArchivedDuration = channel.defaultAutoArchivedDuration;
        this.flags = channel.flags;
        this.guild_id = channel.guild_id;
        this.icon = channel.icon;
        this.lastMessageId = channel.lastMessageId;
        this.lastPinTimestamp = channel.lastPinTimestamp;
        this.member = channel.member;
        this.memberCount = channel.memberCount;
        this.memberIdsPreview = channel.memerIdsPreview;
        this.memberListId = channel.memberListId
        this.messagesCount = channel.messagesCount;
        this.nicks = channel.nicks;
        this.nsfw = channel.nsfw;
        this.originChannelId = channel.originChannelId;
        this.ownerId = channel.ownerId;
        this.parent_id = channel.parent_id;
        this.permissionOverwrites = channel.permissionOverwrites;
        this.position = channel.position;
        this.rateLimitPerUser = channel.rateLimitPerUser;
        this.rawRecipients = channel.rawRecipients;
        this.recipients = channel.recipients;
        this.rtcRegion = channel.rtcRegion;
        this.threadMetadata = channel.threadMetadata;
        this.topic = channel.topic;
        this.type = channel.type;
        this.userLimit = channel.userLimit;
        this.videoQualityMode = channel.videoQualityMode;
    }

    private channel: any;

    public application_id: string
    public appliedTags: string[]
    public availableTags: string[]
    public bitrate: number
    public defaultAutoArchivedDuration: number
    public flags: number
    public guild_id: string
    public icon: string
    public lastMessageId: string
    public lastPinTimestamp: string
    public member: any
    public memberCount: number
    public memberIdsPreview: any
    public memberListId: string
    public messagesCount: number
    public nicks: {}
    public nsfw: false
    public originChannelId: string
    public ownerId: string
    public parent_id: string
    public permissionOverwrites: PermissionOverwrite
    public position: number
    public rateLimitPerUser: number
    public rawRecipients: []
    public recipients: []
    public rtcRegion: string
    public threadMetadata: any
    public topic: string
    public type: number
    public userLimit: number
    public videoQualityMode: number
    public get lastActiveTimestamp(): number { return this.channel.lastActiveTimestamp; }
    public get accessPermissions(): number { return this.channel.accessPermissions; }

    public static GetChannel(BDFDB: any, id: string) {
        return new Channel(BDFDB.LibraryModules.ChannelStore.getChannel(id || BDFDB.LibraryModules.LastChannelStore.getChannelId()));
    }
}
export class User extends Item {
    constructor(user: any) {
        super({id: user.id, name: user.tag});

        this.accentColor = user.accentColor;
        this.avatar = user.avatar;
        this.banner = user.banner;
        this.bio = user.bio;
        this.bot = user.bot;
        this.desktop = user.desktop;
        this.discriminator = user.discriminator;
        this.email = user.email;
        this.flags = user.flags;
        this.guildMemberAvatars = user.guildMemberAvatars;
        this.mfaEnabled = user.mfaEnabled;
        this.mobile = user.mobile;
        this.nsfwAllowed = user.nsfwAllowed;
        this.phone = user.phone;
        this.premiumType = user.premiumType
        this.publicFlags = user.publicFlags;
        this.system = user.system;
        this.username = user.username;
        this.verified = user.verified;
    }

    public accentColor: number
    public avatar: string
    public banner: string
    public bio: string
    public bot: boolean
    public desktop: boolean
    public discriminator: string
    public email: string
    public flags: number
    public guildMemberAvatars: { [guildId: string]: string }
    public mfaEnabled: boolean
    public mobile: boolean
    public nsfwAllowed: boolean
    public phone: string
    public premiumType: number
    public publicFlags: number
    public system: string
    public username: string
    public verified: boolean

    public get avatarURL(): string { return this.avatar ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${this.avatar.startsWith("a_") ? "gif" : "png"}` : null; }
    public get createdAt(): Date { return undefined }
    public get hasPremiumPerks(): boolean { return this.premiumType != 0; }
    public get tag(): string { return `${this.username}#${this.discriminator}` }
    public get usernameNormalized(): string { return this.username.toLowerCase(); }
}
export class PermissionOverwrite {
    constructor(permissionOverwrite: any) {
        this.allow = permissionOverwrite.allow;
        this.deny = permissionOverwrite.deny;
        this.id = permissionOverwrite.id;
        this.type = permissionOverwrite.type;
    }

    public allow: number
    public deny: number
    public id: string
    public type: number
}
export class Message extends Item {
    constructor(message: any) {
        super(message);  
    }
}
export class Emoji extends Item {
    constructor(emoji: any) {
        super(emoji);
        this.animated = emoji.animated;
    }

    public animated: boolean
}