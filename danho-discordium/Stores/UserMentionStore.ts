import { Store } from '@discordium/modules/flux';
import { Message, Snowflake } from '@discord';
import { Finder } from '@discordium/api';

export interface UserMentionStore extends Store {
    get everyoneFilter(): boolean
    get guildFilter(): string | "ALL_SERVERS"
    get hasLoadedEver(): boolean
    get hasMore(): boolean
    get lastLoaded(): number
    get loading(): boolean
    get mentionsAreStale(): boolean
    get roleFilter(): boolean

    isOpen(): boolean
    getMentions(): Array<Message>
}
export const UserMentionStore: UserMentionStore = Finder.byProps("getMentions", "everyoneFilter");
export default UserMentionStore;