import { Emoji, Snowflake } from "@discord";
import { Finder } from "@discordium/api";
import { Store } from "@discordium/modules/flux";

export interface GuildEmojiStore extends Store {
    getEmojiRevision(guildId: Snowflake): number;
    getEmojis(guildId: Snowflake): Record<Snowflake, Emoji>;
    isUploadingEmoji(): boolean
}
export const GuildEmojiStore: GuildEmojiStore = Finder.byProps("getEmojis");
export default GuildEmojiStore;