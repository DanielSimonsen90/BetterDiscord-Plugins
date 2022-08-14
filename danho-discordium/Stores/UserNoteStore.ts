import { Finder } from '@discordium/api';
import { Store } from '@discordium/modules/flux';

export interface UserNoteStore extends Store {
    getNote(userId: string): string | undefined;
}
export const UserNoteStore: UserNoteStore = Finder.byProps("getNote", "_dispatcher");
export default UserNoteStore;