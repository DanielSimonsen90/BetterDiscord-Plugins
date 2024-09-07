import { EmojiStore } from "@danho-lib/Stores";
import createPatcherCallback from "@danho-lib/Patcher/CreatePatcherCallback";

export const favorFavoriteEmojis = createPatcherCallback<EmojiStore['getSearchResultsOrder']>(({
  args,
  original: __getStoreSearchResults
}) => {
  const emojis = __getStoreSearchResults(...args);
  const query = args[1];
  const favorites = EmojiStore.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest;

  return emojis.sort((a, b) => {
    const aIsFavorite = favorites.some(e => e.id === a.id);
    const bIsFavorite = favorites.some(e => e.id === b.id);
    
    return (
      aIsFavorite && !bIsFavorite ? -1 
      : !aIsFavorite && bIsFavorite ? 1
      : 0
    );
  });
});