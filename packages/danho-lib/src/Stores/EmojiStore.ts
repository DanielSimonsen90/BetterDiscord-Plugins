import type { Snowflake } from "@discord/types/base";
import type { Emoji as BaseEmoji } from "@discord/types/guild/emoji";
import type { Channel } from '@discord/types/channel';
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface EmojiStore extends Store {
    get categories(): Array<EmojiCategoryItem>;
    get diversitySurrogate(): string;
    get emojiFrecencyWithoutFetchingLatest(): EmojiFrequency

    getCustomEmojiById(id: Snowflake): CustomEmoji;
    getDisambiguatedEmojiContext(guilId?: Snowflake): { 
        /** All custom emotes for user */
        customEmojis: Array<CustomEmoji>;
        /** Default emojis */
        disambiguatedEmoji: Array<DisambiguatedEmoji>
        emojisById: Record<Snowflake, Emoji>;
        emojisByName: Record<string, Emoji>;
        emoticonRegex: null;
        emoticonsByName: Record<string, Emoji>;
        escapedEmoticonNames: string;
        favoriteNamesAndIds: Set<string>;
        favorites: Array<Emoji>;
        frequentlyUsed: null;
        frequentlyUsedreactionEmojis: Array<Emoji>;
        groupedCustomEmojis: { [guildId: Snowflake]: Array<CustomEmoji> }
        guildId: null | Snowflake;
        isFavoriteEmojiWithoutFetcingLatest(emojiId: Snowflake): boolean;
        newlyAddedEmojis: { [guildId: Snowflake]: Array<CustomEmoji> };
        topEmojis: null;
        unicodeAliases: Record<string, DisambiguatedEmoji['name']>;

        getFrequentlyUsedReactionEmojisWithoutFetchingLatest(): Array<Emoji>;
        getFrequentlyUsedEmojisWithoutFetchingLatest(): Array<Emoji>;
        isFavoriteEmojiWithoutFetchingLatest(emojiId: Snowflake): boolean;
        getEmojiInPriorityOrderWithoutFetchingLatest(): Array<Emoji>;

        getById(emojiId: Snowflake): Emoji;
        getByName(emojiName: string): Emoji;
        getCustomEmoji(): Array<CustomEmoji>;
        getCustomEmoticonRegex(): RegExp;
        getDisambiguatedEmojiById(): DisambiguatedEmoji;
        getEmojiInPriorityOrderWithoutFetchingLatest(): Array<Emoji>;
        
        get favoriteEmojisWithoutFetchingLatest(): Array<Emoji>; 
    };
    getGuildEmoji(guildId: Snowflake): Array<CustomEmoji>;
    getGuilds(): Record<Snowflake, GetGuildsThing>;
    getSearchResultsOrder(results: Array<Emoji  >, search: string, endIndex: number): Emoji[];
    getState(): Record<'pendingUsages', Array<any>>;
    getUsableCustomEmojiById(id: Snowflake): CustomEmoji;
    hasPendingUsage(): boolean;
    searchWithoutFetchingLatest(
        channel: Channel, 
        collection: Record<`${'un' | ''}locked`, Array<Emoji>>, 
        emojiId: Snowflake, 
        intention?: string, 
        chain?: string
    ): Record<`${'un' | ''}locked`, Array<Emoji>>;
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
    get frequently(): Array<CustomEmoji>;
}

export type CustomEmoji = BaseEmoji & {
    allNamesString: `:${string}:`,
    available: boolean;
    guildId: Snowflake;
    managed: boolean;
    require_colons: boolean;
    roles: [];
    url: string;
}

export type DisambiguatedEmoji = {
    diversityChildren: {};
    emojiObject: {
        names: Array<string>,
        surrogates: string,
        unicodeVersion: number
    };
    guildId: undefined | Snowflake;
    id: undefined | Snowflake;
    index: number;
    originalName: undefined;
    surrogates: string;
    type: number;
    uniqueName: string;
    useSpriteSheet: boolean;

    get allNamesString(): string;
    get animated(): boolean;
    get defaultDiversityChild(): null;
    get hasDiversity(): undefined;
    hasDiversityParent(): undefined;
    hasMultiDiversity(): undefined;
    hasMultiDiversityParent(): undefined;
    get managed(): boolean;
    get name(): string;
    get names(): Array<string>;
    get optionallyDiverseSequence(): string;
    get unicodeVersion(): number;
    get url(): string;
}

export type Emoji = CustomEmoji | DisambiguatedEmoji;

type UsageHistory = {
    totalUses: number,
    recentUses: Array<number>,
    score: number,
    frequency: number
}

interface GetGuildsThing {
    id: Snowflake
    _dirty: boolean
    _emojiMap: Record<Snowflake, CustomEmoji>
    _userId: Snowflake
    get emojis(): Array<CustomEmoji>
    get emoticons(): []
    get usableEmojis(): Array<CustomEmoji>

    getEmoji(emojiId: Snowflake): CustomEmoji;
    getUsableEmoji(emojiId: Snowflake): CustomEmoji;
    isUsable(emojiId: Snowflake): boolean
}

/**
 * H is defined on line 115062
 */