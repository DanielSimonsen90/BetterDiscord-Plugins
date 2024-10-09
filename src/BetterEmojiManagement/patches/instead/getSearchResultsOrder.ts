import { Patcher } from "@dium/api";
import { EmojiStore } from "@stores";
import { isBanFeatureEnabled } from "../../features/BanEmojis";
import { isFavorFavoriteFeatureEnabled } from "../../features/FavorFavoriteEmojis";
import { Settings } from "src/BetterEmojiManagement/Settings";

export default function insteadGetSearchResultsOrder() {
  if (!isBanFeatureEnabled() && !isFavorFavoriteFeatureEnabled()) return;

  return Patcher.instead(EmojiStore, "getSearchResultsOrder", ({ args, original }) => {
    const sortedByFavorites = isFavorFavoriteFeatureEnabled() 
      ? EmojiStore.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest.map(e => e.id) 
      : [];
    const sortedByBanned = isBanFeatureEnabled() 
      ? Settings.current.bannedEmojis.map(e => e.id) 
      : [];
    const result = original(...args);
    
    return result.sort((a, b) => {
      if (sortedByFavorites.includes(a.id) && !sortedByFavorites.includes(b.id)) return -1;
      if (!sortedByFavorites.includes(a.id) && sortedByFavorites.includes(b.id)) return 1;

      if (sortedByBanned.includes(a.id) && !sortedByBanned.includes(b.id)) return 1;
      if (!sortedByBanned.includes(a.id) && sortedByBanned.includes(b.id)) return -1;
      
      return 0;
    });
  });
}