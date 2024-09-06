import { Patcher } from "@dium/api";
import { EmojiStore } from "@danho-lib/Stores";

export default function FavorFavoriteEmojis() {
  Patcher.instead(EmojiStore, "getSearchResultsOrder", ({ args: [emojis, query, n], original: __getStoreSearchResults }) => {
    const relevantEmojis = __getStoreSearchResults(emojis, query, n);
    const favorites = EmojiStore.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest;
    return relevantEmojis.sort((a, b) => {
      const aIsFavorite = favorites.some(e => e.id === a.id);
      const bIsFavorite = favorites.some(e => e.id === b.id);
      return aIsFavorite && !bIsFavorite ? -1
        : !aIsFavorite && bIsFavorite ? 1
          : 0;
    });
  })
}