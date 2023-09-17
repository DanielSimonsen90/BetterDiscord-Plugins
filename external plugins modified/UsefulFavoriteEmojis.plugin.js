/**
 * @name UsefulFavoriteEmojis
 * @author Danho
 * @description Sorts searched emojis by favorite, because apparently Discord doesn't do that already.
 * @version 1.0.0
 */
module.exports = meta => {
  // #region === Type Definitions because JS sucks and TS is better ===

  /**
   * @typedef {object} Emoji
   * @property {string} allNamesString
   * @property {boolean} animated
   * @property {boolean} available
   * @property {string} guildId
   * @property {string} id
   * @property {boolean} managed
   * @property {string} name
   * @property {boolean} require_colons
   * @property {Array<any>} roles
   * @property {string} type
   * @property {string} url
  */

  /**
   * @typedef {object} EmojiStore
   * @property {() => any} getGuilds
   * @property {() => any} getState
   * @property {() => any} hasPendingUsage
   * @property {() => any} hasUsableEmojiInAnyGuild
   * @property {() => any} __getLocalVars
   * @property {(e: any) => any} getBackfillTopEmojis
   * @property {(e: any) => any} getCustomEmojisById
   * @property {(guildId?: string) => { favoriteEmojisWithoutFetchingLatest: Array<Emoji> }} getDisambiguatedEmojiContext
   * @property {(e: any) => any} getGuildEmoji
   * @property {(e: any) => any} getNewlyAddedEmoji
   * @property {(e: any) => any} getTopEmoji
   * @property {(e: any) => any} getTopEmojisMetadata
   * @property {(e: any) => any} getUsableCustomEmojiById
   * @property {(e: any) => any} getUsableGuildEmoji
   * @property {(e: any) => any} hasFavoriteEmojis
   * @property {(e: any) => any} initialize
   * @property {(e: any) => any} searchWithoutFetchingLatest
   * @property {(e: any, t: any, n: any) => any} getSearchResultsOrder
   */

  // #endregion

  /**
   * Function used instead of original emojiStore.getSearchResultsOrder
   * @param {EmojiStore} store 
   * @param {[Array<Emoji>, string, number]} props 
   * @param {typeof(insteadEmojiStoreSearchReults)} original 
   */
  const fixSearchResults = (store, [emojis, query, n], __getStoreSearchResults) => {
    const relevantEmojis = __getStoreSearchResults(emojis, query, n);
    const favorites = store.getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest;
    return relevantEmojis.sort((a, b) => {
      const aIsFavorite = favorites.some(e => e.id === a.id);
      const bIsFavorite = favorites.some(e => e.id === b.id);
      return aIsFavorite && !bIsFavorite ? -1
        : !aIsFavorite && bIsFavorite ? 1
        : 0;
    });
  };

  /**
   * @returns {EmojiStore}
   */
  const getEmojiStore = () => BdApi.Webpack.getByKeys("getSearchResultsOrder");

  return {
    start() {
      const emojiStore = getEmojiStore();
      BdApi.Patcher.instead("UsefulFavoriteEmojis", emojiStore, "getSearchResultsOrder", fixSearchResults);
    },
  
    stop() {
      BdApi.Patcher.unpatchAll("UsefulFavoriteEmojis");
    }
  }
}
