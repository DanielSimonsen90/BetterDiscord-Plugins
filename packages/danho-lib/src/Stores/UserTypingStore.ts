import type { Snowflake } from "@discord/types/base";
import { Finder } from '@dium/api';
import { Store } from '@dium/modules/flux';

export interface UserTypingStore extends Store {
    /** Returns object where keys are User snowflakes and value is assumed to be typing time in ms */
    getTypingUsers(channelId: Snowflake): Record<Snowflake, undefined | number>;
    isTyping(channelId: Snowflake, userId: Snowflake): boolean
}
export const UserTypingStore: UserTypingStore = Finder.byKeys(["getTypingUsers", "isTyping"]);
export default UserTypingStore;