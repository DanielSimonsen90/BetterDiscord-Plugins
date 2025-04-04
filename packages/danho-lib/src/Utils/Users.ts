import type { BetterOmit, FilterStore } from "./types";
import type { User, UserStatus } from '@discord/types/user';

import {
  UserActivityStore,
  UserNoteStore,
  UserTypingStore,
  UserMentionStore,
  PresenceStore,
  UserStore, RelationshipStore
} from '@stores';

import UserNoteActions from '@actions/UserNoteActions';

type MyUser = User & {
  get status(): UserStatus;
}

type CompiledUserUtils = BetterOmit<
  & FilterStore<UserStore>
  & FilterStore<PresenceStore>
  & FilterStore<RelationshipStore>
  & FilterStore<UserActivityStore>
  & FilterStore<UserNoteStore>
  & FilterStore<UserTypingStore>
  & FilterStore<UserMentionStore>

  & UserNoteActions
  , '__getLocalVars' | 'getStatus' | 'getState'
> & {
  get me(): MyUser;
  getPresenceState: typeof PresenceStore["getState"];
  getUserByUsername(tag: string): User | undefined;
};

export const UserUtils: CompiledUserUtils = {
  ...UserStore as UserStore,
  ...PresenceStore,
  ...RelationshipStore,
  ...UserActivityStore,
  ...UserNoteStore,
  ...UserTypingStore,
  ...UserMentionStore,

  ...UserNoteActions,

  get me() {
    const user = UserStore.getCurrentUser();
    return Object.assign(user, {
      get status() {
        return PresenceStore.getStatus(user.id);
      }
    }) as MyUser;
  },

  getPresenceState: () => PresenceStore.getState(),
  getUserByUsername(username) {
    return Object.values(UserStore.getUsers()).find(user => user.username === username);
  },
};
export default UserUtils;
