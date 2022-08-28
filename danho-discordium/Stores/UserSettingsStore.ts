import { ActivityIndexes, ActivityTypes, GuildFolder, Snowflake, StatusType } from "@discord";
import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";
import { Theme } from "./ThemeStore";

export interface UserSettingsStore extends Store {
    get locale(): string;
    get theme(): Theme;

    getAllSettings(): AllUserSettings;
    __getLocalVars(): {
        CACHE_KEY: string;
        defaultTheme: Theme;
        settings: AllUserSettings;
        store: UserSettingsStore;
        systemPrefersColorScheme: Theme;
        useForceColors: boolean;
    }
}

/**
 * @error This is no longer used in Discord.
 */
export const UserSettingsStore: UserSettingsStore = Finder.byName("UserSettingsStore");
export default UserSettingsStore;

type AllUserSettings = {
    afkTimeout: number,
    allowAccessibilityDetection: boolean,
    animateEmoji: boolean,
    animateStickers: boolean,
    contactSyncUpsellShown: boolean,
    convertEmojicons: boolean,
    customStatus: {
        [Key in `emoji${Capitalize<keyof Pick<ActivityTypes[ActivityIndexes.CUSTOM], 'id' | 'name'>>}`]?: string
    },
    defaultGuildsRestricted: boolean,
    detectPlatformAccounts: boolean,
    developerMode: boolean,
    disableGamesTab: boolean,
    enableTTSCommand: boolean,
    explicitContentFilter: number,
    friendDiscoveryFlags: number,
    friendSourceFlags: Record<`mutual_${'friends' | 'guilds'}`, boolean>,
    gifAutoPlay: boolean,
    guildFolders: Array<GuildFolder>,
    guildPositions: Array<Snowflake>
    inlineAttachmentMedia: boolean,
    inlineEmbedMedia: boolean,
    locale: string,
    messageDisplayCompact: boolean,
    nativePhoneIntegrationEnabled: boolean,
    passwordless: boolean,
    renderEmbeds: boolean,
    restrictedGuilds: Array<Snowflake>,
    showCurrentGame: boolean,
    status: StatusType,
    streamNotificationsEnabled: boolean,
    theme: Theme,
    timezoneOffset: number,
    viewNsfwGuilds: boolean,
}
