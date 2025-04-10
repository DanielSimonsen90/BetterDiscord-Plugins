import { User } from "@discord/types";
import { Logger } from "@dium";

import { ActionsEmitter, RelationshipActions } from "@actions";
import { UserProfileStore } from "@stores";

import { Settings } from "../settings/Settings";

export default function onRelationshipAdd() {
	const cancelFriendRequest = (user: User) => {
		RelationshipActions.cancelFriendRequest(user.id, 'friends');
		const message = `Blocked friend request from ${user.username} (${user.id}) because they are in a blocked folder`;
		Logger.log(message);
		BdApi.UI.showToast(message, { type: 'success' });
	};
	
	ActionsEmitter.on('RELATIONSHIP_ADD', ({ relationship }) => {
		const mutualGuilds = UserProfileStore.getMutualGuilds(relationship.user.id);
		if (!mutualGuilds || !mutualGuilds.length) {
			const mutualFriends = UserProfileStore.getMutualFriends(relationship.user.id);

			// Cancel friend request if there are no mutual friends and settings allow it
			if (!mutualFriends && !mutualFriends.length && Settings.current.cancelNoMutuals) {
				cancelFriendRequest(relationship.user);
			}
		}

		// Friend requester shares 1+ guild(s) with user
		const shouldCancel = mutualGuilds.some(({ guild }) => Settings.isBlocked(guild.id));
		if (shouldCancel) return cancelFriendRequest(relationship.user);
	})
}