import { BetterOmit } from 'danholibraryjs';
import { FilterStore } from "./types";

import { UserStore, RelationshipStore, User } from '@dium/modules/user';

import UserActivityStore from '@stores/UserActivityStore';
import UserNoteStore from '@stores/UserNoteStore';
import UserTypingStore from '@stores/UserTypingStore';
import UserMentionStore from '@stores/UserMentionStore';
import PresenceStore, { StatusTypes } from '@stores/PresenceStore';

import UserNoteActions from '@actions/UserNoteActions';

type MyUser = User & {
  get status(): StatusTypes;
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
    });
  },

  getPresenceState: () => PresenceStore.getState(),
};
export default UserUtils;
