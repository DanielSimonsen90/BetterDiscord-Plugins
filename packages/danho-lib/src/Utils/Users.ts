import type { BetterOmit, FilterStore } from "./types";
import type { User, UserStatus } from '@discord/types/user';

import {
  UserActivityStore,
  UserNoteStore,
  UserTypingStore,
  UserMentionStore,
  PresenceStore,
  UserStore, 
  RelationshipStore,
  MessageStore,
  SelectedGuildStore,
  SelectedChannelStore
} from '@stores';

import UserNoteActions from '@actions/UserNoteActions';
import { ActionsEmitter } from "@actions";

type MyUser = User & {
  get status(): UserStatus;
};

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
  getUsersPrioritizingFriends(byName?: string): Array<User>;
  openModal(userId: string, showGuildProfile?: boolean): void;
  getUsernames(user: User, lowered?: boolean): string[];
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
  getUsersPrioritizingFriends(byName?: string) {
    const getUsername = (user: User) => this.getUsernames(user, true).shift();
    const sort = (a: User, b: User) => getUsername(a).localeCompare(getUsername(b));

    const friends = RelationshipStore
      .getFriendIDs()
      .map(UserStore.getUser)
      .sort(sort);
    const users = Object
      .values(UserStore.getUsers())
      .sort(sort);

    const result = [...friends, ...users].filter((user, index, self) => (
      index === self.findIndex(u => u.id === user.id)
    ));

    return byName 
      ? result.filter(user => getUsername(user).includes(byName.toLowerCase())) 
      : result;
  },
  openModal(userId, showGuildProfile = false) {
    const currentGuildId = SelectedGuildStore.getGuildId();
    const currentChannelId = SelectedChannelStore.getChannelId();

    ActionsEmitter.emit('USER_PROFILE_MODAL_OPEN', {
      type: 'USER_PROFILE_MODAL_OPEN',
      userId,
      channelId: currentChannelId,
      guildId: currentGuildId,
      messageId: MessageStore.getLastMessage(currentChannelId)?.id,
      sessionId: undefined,
      showGuildProfile,
      sourceAnalyticsLocations: [
        "username",
        "bite size profile popout",
        "avatar"
      ]
    })
  },
  getUsernames(user, lowered = false) {
    return [
      user.globalName,
      user.username,
      user.tag
    ]
    .filter(Boolean)
    .map(name => lowered ? name.toLowerCase() : name);
  },
};
export default UserUtils;
