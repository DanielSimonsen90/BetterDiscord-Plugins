import type { Snowflake } from "@discord/types/base";
import type { Emoji } from "@discord/types/guild/emoji";
import { Finder } from "@dium/api";
import { Store } from "@dium/modules/flux";

export interface GuildEmojiStore extends Store {
    getEmojiRevision(guildId: Snowflake): number;
    getEmojis(guildId: Snowflake): Record<Snowflake, Emoji>;
    isUploadingEmoji(): boolean
}
export const GuildEmojiStore: GuildEmojiStore = Finder.byKeys(["getEmojis"]);
export default GuildEmojiStore;