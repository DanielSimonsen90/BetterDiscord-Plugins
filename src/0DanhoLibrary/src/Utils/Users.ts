import { BetterOmit } from 'danholibraryjs';
import { FilterStore } from "danho-discordium/Utils";
import BDFDB from '@BDFDB';
import NitroUtils from '@lib/BDFDB/LibraryModules/NitroUtils';

import { Snowflake } from '@discord';
import { UserStore, PresenceStore, RelationshipStore, StatusType, User } from '@discordium/modules/user';

import UserActivityStore from '@stores/UserActivityStore';
import UserNoteStore from '@stores/UserNoteStore';
import UserTypingStore from '@stores/UserTypingStore';
import UserMentionStore from '@stores/UserMentionStore';

import UserNoteActions from '@actions/UserNoteActions';

type CompiledUserUtils = BetterOmit<BDFDB["UserUtils"]
    & FilterStore<UserStore>
    & FilterStore<PresenceStore>
    & FilterStore<RelationshipStore>
    & FilterStore<UserActivityStore>
    & FilterStore<UserNoteStore>
    & FilterStore<UserTypingStore>
    & FilterStore<UserMentionStore>

    & UserNoteActions
    & NitroUtils
    , '__getLocalVars' | 'getStatus' | 'getState'
> & {
    getStatus(userOrId: User | Snowflake): StatusType,
    getPresenceState: typeof PresenceStore["getState"]
};

export const UserUtils: CompiledUserUtils = {
    ...window.BDFDB.UserUtils,
    ...UserStore as UserStore,
    ...PresenceStore,
    ...RelationshipStore,
    ...UserActivityStore,
    ...UserNoteStore,
    ...UserTypingStore,
    ...UserMentionStore,

    ...UserNoteActions,
    ...window.BDFDB.LibraryModules.NitroUtils,

    getStatus: (userOrId: User | Snowflake): StatusType => window.BDFDB.UserUtils.getStatus(typeof userOrId === 'string' ? userOrId : userOrId.id),
    getPresenceState: () => PresenceStore.getState()
};
export default UserUtils;

