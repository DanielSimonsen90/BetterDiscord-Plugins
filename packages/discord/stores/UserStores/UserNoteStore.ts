import { Finder } from '@injections';
import { Store } from '@dium/modules/flux';

export interface UserNoteStore extends Store {
  getNote(userId: string): {
    loading: boolean;
    note: string | undefined;
  };
}
export const UserNoteStore = Finder.byKeys<UserNoteStore>(["getNote", "_dispatcher"]);
export default UserNoteStore;