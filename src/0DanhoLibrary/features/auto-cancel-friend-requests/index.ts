import { ActionsEmitter } from "@danho-lib/Actions";
import { Logger } from "@dium";
import { Settings } from "src/0DanhoLibrary/Settings";
import { SortedGuildStore, UserProfileStore } from '@stores';
import { RelationshipActions } from "@danho-lib/Actions/RelationshipActions";
import PatchGuildContextMenu from "@danho-lib/ContextMenus/GuildContextMenu";
import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";

export default function Feature() {
  if (!Settings.current.autoCancelFriendRequests || Settings.current.folderNames.length === 0) return;

  ActionsEmitter.on('RELATIONSHIP_ADD', ({ relationship }) => {
    const blockFolderNames = Settings.current.folderNames;
    const blockFolders = SortedGuildStore.getGuildFolders().filter(folder => blockFolderNames.includes(folder.folderName));
    if (blockFolders.length === 0) return;

    const cancelFriendRequest = () => {
      RelationshipActions.cancelFriendRequest(relationship.user.id, 'friends');
      const message = `Blocked friend request from ${relationship.user.username} (${relationship.user.id}) because they are in a blocked folder`;
      Logger.log(message);
      BdApi.UI.showToast(message, { type: 'success' });
    }

    const mutualGuildIds = UserProfileStore.getMutualGuilds(relationship.user.id)?.map(v => v.guild.id);
    if (mutualGuildIds === undefined) return cancelFriendRequest();
    else if (mutualGuildIds.length === 0) return;

    const mutualGuildIdsInBlockFolders = mutualGuildIds.filter(guildId => blockFolders.some(folder => folder.guildIds.includes(guildId)));
    if (mutualGuildIdsInBlockFolders.length === 0) return;
    else if (mutualGuildIdsInBlockFolders.length !== mutualGuildIds.length) return;


  });

  PatchGuildContextMenu((menu, props) => {
    if (!props.folderName) return;
    const isInBlockedFolder = Settings.current.folderNames.includes(props.folderName);
    
    menu.props.children.push(
      buildTextItemElement('danho-block-friend-requests', isInBlockedFolder ? 'Unblock friend requests' : 'Block friend requests', () => {
        Settings.update(cur => ({ ...cur, folderNames: isInBlockedFolder 
          ? cur.folderNames.filter(v => v !== props.folderName) 
          : [...cur.folderNames, props.folderName] }));
      }, { color: 'danger' }) as any
    );
  })
}