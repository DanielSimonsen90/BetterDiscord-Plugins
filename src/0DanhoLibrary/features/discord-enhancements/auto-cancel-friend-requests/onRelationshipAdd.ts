import { Logger } from "@dium";

import { createActionCallback } from "@actions";
import { RelationshipActions } from "@actions/RelationshipActions";
import { SortedGuildStore, UserProfileStore } from '@stores';

import { Settings } from "src/0DanhoLibrary/Settings";
export default createActionCallback('RELATIONSHIP_ADD', ({ relationship }) => {
  const blockFolderNames = Settings.current.folderNames;
  const blockFolders = SortedGuildStore.getGuildFolders().filter(folder => blockFolderNames.includes(folder.folderName));
  if (blockFolders.length === 0) return;

  const cancelFriendRequest = () => {
    RelationshipActions.cancelFriendRequest(relationship.user.id, 'friends');
    const message = `Blocked friend request from ${relationship.user.username} (${relationship.user.id}) because they are in a blocked folder`;
    Logger.log(message);
    BdApi.UI.showToast(message, { type: 'success' });
  };

  const mutualGuildIds = UserProfileStore.getMutualGuilds(relationship.user.id)?.map(v => v.guild.id);
  if (mutualGuildIds === undefined) {
    const mutualFriends = UserProfileStore.getMutualFriends(relationship.user.id);
    if (!mutualFriends?.length) cancelFriendRequest();
    return;
  }
  else if (mutualGuildIds.length === 0) return;

  const mutualGuildIdsInBlockFolders = mutualGuildIds.filter(guildId => blockFolders.some(folder => folder.guildIds.includes(guildId)));
  if (mutualGuildIdsInBlockFolders.length === 0) return;
  else if (mutualGuildIdsInBlockFolders.length !== mutualGuildIds.length) return;
})