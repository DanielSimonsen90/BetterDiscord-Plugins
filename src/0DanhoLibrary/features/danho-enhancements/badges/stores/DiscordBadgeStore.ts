import { ActionsEmitter, createActionCallback } from "@actions";
import { DanhoStores, DiumStore } from "@stores";
import { UserProfileBadge } from "@discord/components";

type State = {
  [badgeId: string]: UserProfileBadge;
};

const DiscordBadgesStore = new class DiscordBadgeStore extends DiumStore<State> {
  constructor() {
    super({}, 'DiscordBadgeStore', () => {
      ActionsEmitter.on('USER_PROFILE_FETCH_SUCCESS', this.onUserProfileFetchSuccess.bind(this));
    });
  }

  protected onUserProfileFetchSuccess = createActionCallback('USER_PROFILE_FETCH_SUCCESS',
    ({ badges }) => {
      if (!badges?.length) return;

      const updates = badges.filter(badge => {
        const stored = this.current[badge.id];
        return !stored || stored.icon !== badge.icon;
      });

      if (updates.length) this.update(updates.reduce((acc, badge) => {
        acc[badge.id] = badge;
        return acc;
      }, {} as State));
    });
};

DanhoStores.register(DiscordBadgesStore);

export default DiscordBadgesStore;