import { EmojiStore } from "@danho-lib/Stores";
import createPatcherCallback from "@danho-lib/Patcher/CreatePatcherCallback";

export const favorFavoriteEmojis = createPatcherCallback<EmojiStore['getSearchResultsOrder']>(({
  args: [emojis, query, n],
  original: __getStoreSearchResults
}) => {
  const relevantEmojis = __getStoreSearchResults(emojis, query, n);
  const favorites = EmojiStore.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest;
  return relevantEmojis.sort((a, b) => {
    const aIsFavorite = favorites.some(e => e.id === a.id);
    const bIsFavorite = favorites.some(e => e.id === b.id);
    return aIsFavorite && !bIsFavorite ? -1
      : !aIsFavorite && bIsFavorite ? 1
        : 0;
  });
});