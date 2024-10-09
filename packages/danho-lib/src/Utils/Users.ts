import { BetterOmit, FilterStore } from "./types";

import { UserStore, RelationshipStore, User } from '@dium/modules/user';

import UserActivityStore from '@danho-lib/Stores/UserStores/UserActivityStore';
import UserNoteStore from '@danho-lib/Stores/UserStores/UserNoteStore';
import UserTypingStore from '@danho-lib/Stores/UserStores/UserTypingStore';
import UserMentionStore from '@danho-lib/Stores/UserStores/UserMentionStore';
import PresenceStore from '@danho-lib/Stores/UserStores/PresenceStore';

import UserNoteActions from '@actions/UserNoteActions';
import { UserStatus } from '@discord/types/user/status';

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
