import { Emoji, EmojiStore } from "@discord/stores";
import { createPatcherCallback } from "@injections";
import { Settings } from "../settings/Settings";

export const isFavorFavoriteFeatureEnabled = () => Settings.current.enableFavorFavoriteEmojis;

export const favorFavoriteEmojis = createPatcherCallback<EmojiStore['getSearchResultsOrder'], Emoji[]>(({
  args,
  original: __getStoreSearchResults
}) => {
  const emojis = __getStoreSearchResults(...args);
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