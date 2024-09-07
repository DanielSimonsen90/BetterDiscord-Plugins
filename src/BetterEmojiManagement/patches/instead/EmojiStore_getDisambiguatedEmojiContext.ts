import { Emoji, EmojiStore } from "@danho-lib/Stores";
import { Patcher } from "@dium/api";
import { Settings } from '../../Settings';

export default function insteadEmojiStore_getDisambiguatedEmojiContext() {
  Patcher.instead(EmojiStore, 'getDisambiguatedEmojiContext', ({ args, original: getDisambiguatedEmojiContext }) => {
    const bannedEmojiIds = Settings.current.bannedEmojis.map(e => e.id);
    const sortBannedToEnd = <TEmoji extends Emoji>(emojis: TEmoji[]) => emojis.sort((a, b) => {
      const aIsBanned = bannedEmojiIds.includes(a.id);
      const bIsBanned = bannedEmojiIds.includes(b.id);
      return (
        aIsBanned && !bIsBanned ? 1
          : !aIsBanned && bIsBanned ? -1
            : 0
      );
    });

    const result = getDisambiguatedEmojiContext(...args);
    const _favoriteEmojisWithoutFetchingLatest = result.favoriteEmojisWithoutFetchingLatest;

    const replacedVariableKeys: (keyof ReturnType<EmojiStore['getDisambiguatedEmojiContext']>)[] = [
      'favoriteEmojisWithoutFetchingLatest', // Favorite emojis 
      'getFrequentlyUsedEmojisWithoutFetchingLatest',  // Recent emojis
      'getCustomEmoji' // Guild emojis
    ];

    // const returnValue = Object.keys(result).reduce((acc, key) => {
    //   if (replacedVariableKeys.includes(key as keyof ReturnType<EmojiStore['getDisambiguatedEmojiContext']>)) {
    //     return acc;
    //   }

    //   acc[key] = result[key];
    //   return acc;
    // }, {
    //   get favoriteEmojisWithoutFetchingLatest() { return sortBannedToEnd(_favoriteEmojisWithoutFetchingLatest) },
    //   getFrequentlyUsedEmojisWithoutFetchingLatest: function () { return sortBannedToEnd(result.getFrequentlyUsedEmojisWithoutFetchingLatest()) },
    //   getCustomEmoji: function () { return sortBannedToEnd(result.getCustomEmoji()) }
    // } as ReturnType<EmojiStore['getDisambiguatedEmojiContext']>);

    const returnValue = Object.assign({}, result, {
      ...result,
      get favoriteEmojisWithoutFetchingLatest() { return sortBannedToEnd(_favoriteEmojisWithoutFetchingLatest); },
      getFrequentlyUsedEmojisWithoutFetchingLatest: function () { return sortBannedToEnd(result.getFrequentlyUsedEmojisWithoutFetchingLatest()); },
      getCustomEmoji: function () { return sortBannedToEnd(result.getCustomEmoji()); }
    });

    return returnValue;
  });
}