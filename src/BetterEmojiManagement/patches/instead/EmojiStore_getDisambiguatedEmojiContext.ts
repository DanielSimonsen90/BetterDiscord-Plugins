import { CustomEmoji, Emoji, EmojiStore } from "@danho-lib/Stores";
import { Patcher } from "@dium/api";
import { Settings } from '../../Settings';

export default function insteadEmojiStore_getDisambiguatedEmojiContext() {
  Patcher.instead(EmojiStore, 'getDisambiguatedEmojiContext', ({ args, original: getDisambiguatedEmojiContext }) => {
    const bannedEmojiIds = Settings.current.bannedEmojis.map(e => e.id);
    const sortBannedToEnd = <TEmoji extends Emoji>(emojis: TEmoji[]) => {
      try {
        return emojis.sort((a, b) => {
          const aIsBanned = bannedEmojiIds.includes(a.id);
          const bIsBanned = bannedEmojiIds.includes(b.id);
          return (
            aIsBanned && !bIsBanned ? 1
            : !aIsBanned && bIsBanned ? -1
          : 0
          );
        });
      } catch (err) {
        console.error(err, emojis);
        return emojis;
      }
    }

    const result = getDisambiguatedEmojiContext(...args);
    return {
      _original: result,

      getFrequentlyUsedReactionEmojisWithoutFetchingLatest: function () { return sortBannedToEnd(result.getFrequentlyUsedReactionEmojisWithoutFetchingLatest()); },
      getFrequentlyUsedEmojisWithoutFetchingLatest: function () { return sortBannedToEnd(result.getFrequentlyUsedEmojisWithoutFetchingLatest()); }, 
      get favoriteEmojisWithoutFetchingLatest() { return sortBannedToEnd(result.favoriteEmojisWithoutFetchingLatest); },
      getGroupedCustomEmoji: function () { 
        const groupedCustomEmojis = result.getGroupedCustomEmoji();
        return Object.keys(groupedCustomEmojis).reduce((acc, guildId) => {
          acc[guildId] = sortBannedToEnd(groupedCustomEmojis[guildId]);
          return acc;
        }, {} as Record<string, CustomEmoji[]>);
       },
      
      getCustomEmoji: function () { return result.getCustomEmoji(); },
      isFavoriteEmojiWithoutFetchingLatest: function (emojiId: string) { return result.isFavoriteEmojiWithoutFetchingLatest(emojiId); }
    } as any
  });
}