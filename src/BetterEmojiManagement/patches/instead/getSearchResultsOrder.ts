import { Patcher } from "@dium/api";
import { EmojiStore } from "@danho-lib/Stores";
import { sortBannedEmojisOnSearch, isBanFeatureEnabled } from "../../features/BanEmojis";
import { favorFavoriteEmojis, isFavorFavoriteFeatureEnabled } from "../../features/FavorFavoriteEmojis";

export default function insteadGetSearchResultsOrder() {
  if (!isBanFeatureEnabled() && !isFavorFavoriteFeatureEnabled()) return;

  return Patcher.instead(EmojiStore, "getSearchResultsOrder", (data) => {
    const callbacks = [
      // Push favorite emojis first
      isFavorFavoriteFeatureEnabled() && favorFavoriteEmojis,
      // Continue original function
      () => data.original(...data.args), 
      // Force banned emojis last
      isBanFeatureEnabled() && sortBannedEmojisOnSearch
    ].filter(Boolean);
    let result: ReturnType<EmojiStore['getSearchResultsOrder']> = data.args[0];

    for (const callback of callbacks) {
      let args = [...data.args].slice(1) as [string, number];
      result = callback({ ...data, args: [result, ...args] });
    }
    
    return result;
  });
}