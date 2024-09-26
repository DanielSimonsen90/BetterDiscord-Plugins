import { Logger, Patcher } from "@dium/api";
import { Emoji, EmojiStore } from "@danho-lib/Stores";
import { sortBannedEmojisOnSearch, isBanFeatureEnabled } from "../../features/BanEmojis";
import { favorFavoriteEmojis, isFavorFavoriteFeatureEnabled } from "../../features/FavorFavoriteEmojis";

export default function insteadGetSearchResultsOrder() {
  if (!isBanFeatureEnabled() && !isFavorFavoriteFeatureEnabled()) return;

  return Patcher.instead(EmojiStore, "getSearchResultsOrder", (data) => {
    const sortedByFavorites = isFavorFavoriteFeatureEnabled() ? favorFavoriteEmojis(data) : [];
    const sortedByBanned = isBanFeatureEnabled() ? sortBannedEmojisOnSearch(data) : [];
    const original = data.original(...data.args);
    
    const result = original.sort((a, b) => {
      if (sortedByFavorites.includes(a) && !sortedByFavorites.includes(b)) return -1;
      if (sortedByFavorites.includes(b) && !sortedByFavorites.includes(a)) return 1;
      
      if (sortedByBanned.includes(a) && !sortedByBanned.includes(b)) return 1;
      if (sortedByBanned.includes(b) && !sortedByBanned.includes(a)) return -1;
      
      return 0;
    });

    Logger.log(`Sorted "${data.args[1]}"`, result, {
      sortedByFavorites,
      sortedByBanned,
    });
    return result;
  });
}