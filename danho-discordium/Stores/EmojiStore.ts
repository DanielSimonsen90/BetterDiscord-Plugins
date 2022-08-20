import { Snowflake, Emoji as BaseEmoji, Channel } from "@discord";
import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";

export interface EmojiStore extends Store {
    get categories(): Array<EmojiCategoryItem>;
    get diversitySurrogate(): string;
    get emojiFrecencyWithoutFetchingLatest(): EmojiFrequency

    getCustomEmojiById(id: Snowflake): Emoji;
    getDisambiguatedEmojiContext(e?: any): any; // H.get(t) => e._lastInstance = new e(t)
    getGuildEmoji(guildId: Snowflake): Array<Emoji>; // x[e]
    getGuilds(): Record<Snowflake, GetGuildsThing>;
    getSearchResultsOrder(results: Array<any>, search: string, endIndex: number): any;
    getState(): Record<'pendingUsages', Array<any>>;
    getUsableCustomEmojiById(id: Snowflake): Emoji;
    hasPendingUsage(): boolean;
    searchWithoutFetchingLatest(channel: Channel, collection: Record<`${'un' | ''}locked`, Array<Emoji>>, emojiId: Snowflake, intention?: string, chain?: string): Record<`${'un' | ''}locked`, Array<Emoji>>;
    __getLocalVars(): {
        CUSTOM_CATEGORY: 'custom',
        NUM_FREQUENTLY_USED_EMOJI: number,
        RECENT_CATEGORY: 'recent',
        categories: EmojiStore['categories'],
        emojiFrequency: EmojiFrequency,
        emojiIdToGuildId: Record<Snowflake, Snowflake>,
        guilds: ReturnType<EmojiStore['getGuilds']>,
        myCategories: Array<EmojiCategoryItem>,
        state: ReturnType<EmojiStore['getState']>,
    };
}
export const EmojiStore: EmojiStore = Finder.byName("EmojiStore");

export type EmojiCategoryItem = 
    'favorites' |
    'recent' |
    'custom' |
    'people' |
    'nature' |
    'food' |
    'activity' |
    'travel' |
    'objects' |
    'symbols' |
    'flags';

export type EmojiFrequency = {
    afterCompute(): any;
    computeBonus(): any;
    computeWeight(e): any;
    dirty: boolean;
    lookupKey(e): any;
    maxSamples: number;
    numFrequentlyItems: number;
    usageHistory: Record<Snowflake, UsageHistory>,
    get frequently(): Array<Emoji>;
}

export type Emoji = BaseEmoji & {
    allNamesString: `:${string}:`,
    available: boolean;
    guildId: Snowflake;
    managed: boolean;
    require_colons: boolean;
    roles: [];
    url: string;
}

type UsageHistory = {
    totalUses: number,
    recentUses: Array<number>,
    score: number,
    frequency: number
}

interface GetGuildsThing {
    id: Snowflake
    _dirty: boolean
    _emojiMap: Record<Snowflake, Emoji>
    _userId: Snowflake
    get emojis(): Array<Emoji>
    get emoticons(): []
    get usableEmojis(): Array<Emoji>

    getEmoji(emojiId: Snowflake): Emoji;
    getUsableEmoji(emojiId: Snowflake): Emoji;
    isUsable(emojiId: Snowflake): boolean
}

/**
 * H is defined on line 115062
 */