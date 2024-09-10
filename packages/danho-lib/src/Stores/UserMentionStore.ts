import { Message } from '@discord/types/message';
import { Store } from '@dium/modules/flux';
import { Finder } from '@dium/api';

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
export const UserMentionStore: UserMentionStore = Finder.byKeys(["getMentions", "everyoneFilter"]);
export default UserMentionStore;