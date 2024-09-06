import { Emoji } from "@discord/types/guild/emoji";
import { createSettings } from "@dium/settings";

export const Settings = createSettings({
  bannedEmojis: new Array<Pick<Emoji, 'id' | 'name'>>(),
})