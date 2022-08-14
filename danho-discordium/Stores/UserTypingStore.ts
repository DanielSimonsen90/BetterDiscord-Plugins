import { Channel, Snowflake, User } from '@discord';
import { Finder } from '@discordium/api';
import { Store } from '@discordium/modules/flux';

export interface UserTypingStore extends Store {
    /** Returns object where keys are User snowflakes and value is assumed to be typing time in ms */
    getTypingUsers(channelId: Snowflake): Record<Snowflake, undefined | number>;
    isTyping(channelId: Snowflake, userId: Snowflake): boolean
}
export const UserTypingStore: UserTypingStore = Finder.byProps("getTypingUsers", "isTyping");
export default UserTypingStore;