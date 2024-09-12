import { BetterOmit } from 'danholibraryjs';
import { FilterStore } from "./types";

import { UserStore, PresenceStore, RelationshipStore, User, StatusTypes } from '@dium/modules/user';

import UserActivityStore from '@stores/UserActivityStore';
import UserNoteStore from '@stores/UserNoteStore';
import UserTypingStore from '@stores/UserTypingStore';
import UserMentionStore from '@stores/UserMentionStore';

import UserNoteActions from '@actions/UserNoteActions';

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
    getPresenceState: typeof PresenceStore["getState"]
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

    getPresenceState: () => PresenceStore.getState()
};
export default UserUtils;
