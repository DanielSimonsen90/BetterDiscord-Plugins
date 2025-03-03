import { ActionsEmitter } from "@danho-lib/Actions";
import createActionCallback from "@danho-lib/Actions/CreateActionCallback";
import { DiumStore } from "@danho-lib/Stores";
import { UserProfileBadge } from "@discord/components";
import { Logger } from "@dium";

type State = {
  [badgeId: string]: UserProfileBadge;
};

export default new class DiscordBadgeStore extends DiumStore<State> {
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