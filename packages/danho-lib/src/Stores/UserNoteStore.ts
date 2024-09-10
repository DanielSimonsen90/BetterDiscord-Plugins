import { Finder } from '@dium/api';
import { Store } from '@dium/modules/flux';

export interface UserNoteStore extends Store {
    getNote(userId: string): string | undefined;
}
export const UserNoteStore: UserNoteStore = Finder.byKeys(["getNote", "_dispatcher"]);
export default UserNoteStore;