import { Emoji } from "@discord/types/guild/emoji";
import { createSettings } from "@dium/settings";

export const Settings = createSettings({
  bannedEmojis: new Array<Pick<Emoji, 'id' | 'name'>>(),

  enableFavorFavoriteEmojis: true,
  enableBannedEmojis: true,

  acceptBannedEmojisBeta: false,
})

export const titles: Record<keyof typeof Settings.current, string> = {
  enableBannedEmojis: 'Ban your bad emojis (push them to the end)',
  enableFavorFavoriteEmojis: 'Push favorite emojis first on search results',
  bannedEmojis: 'Banned emojis',
  
  acceptBannedEmojisBeta: `Notice: The "Banned Emojis" feature is enabled. This may cause crashes to your client.`
};