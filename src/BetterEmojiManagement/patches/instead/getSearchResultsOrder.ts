import { Patcher } from "@dium/api";
import { EmojiStore } from "@danho-lib/Stores";
import { sortBannedEmojis } from "../../features/BanEmojis";
import { favorFavoriteEmojis } from "../../features/FavorFavoriteEmojis";

export default function insteadGetSearchResultsOrder() {
  return Patcher.instead(EmojiStore, "getSearchResultsOrder", (data) => {
    const callbacks = [favorFavoriteEmojis, sortBannedEmojis];
    let result: ReturnType<EmojiStore['getSearchResultsOrder']> = data.args[0];

    for (const callback of callbacks) {
      let args = [...data.args].slice(1) as [string, number];
      result = callback({ ...data, args: [result, ...args] });
    }
    
    return result;
  });
}