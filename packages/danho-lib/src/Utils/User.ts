import type { User, UserStatus } from '@discord/types/user';

import {
  PresenceStore,
  UserStore,
  RelationshipStore,
  MessageStore,
  SelectedGuildStore,
  SelectedChannelStore
} from '@discord/stores';

import { ActionsEmitter, UserNoteActions } from "@actions";
import { Snowflake } from "@discord/types";

type MyUser = User & {
  get status(): UserStatus;
};

export const UserUtils = {
  ...UserNoteActions,

  get me() {
    const user = UserStore.getCurrentUser();
    return Object.assign(user, {
      getAvatarURL: user.getAvatarURL.bind(user),
    }, {
      get status() {
        return PresenceStore.getStatus(user.id);
      }
    }) as MyUser;
  },

  getPresenceState: () => PresenceStore.getState(),
  getUserByUsername: (username: string) => Object.values(UserStore.getUsers()).find(user => user.username === username),
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
  openModal(userId: Snowflake, showGuildProfile = false) {
    const currentGuildId = SelectedGuildStore.getGuildId();
    const currentChannelId = SelectedChannelStore.getChannelId();

    ActionsEmitter.emit('USER_PROFILE_MODAL_OPEN', {
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
    });
  },
  getUsernames(user: User, lowered = false) {
    return [
      user.globalName,
      user.username,
      user.tag
    ]
      .filter(Boolean)
      .map(name => lowered ? name.toLowerCase() : name);
  },
  getDisplayName(user: User) {
    return this.getUsernames(user).shift();
  },
};
export default UserUtils;
