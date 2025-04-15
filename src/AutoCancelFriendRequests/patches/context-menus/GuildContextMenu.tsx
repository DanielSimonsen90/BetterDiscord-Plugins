import { buildTextItemElement, PatchGuildContextMenu } from "@context-menus";
import { Settings } from "../../settings/Settings";

export default function patchGuildContextMenu() {
  PatchGuildContextMenu((menu, props) => {
    const isFolder = 'folderId' in props && props.folderId !== undefined;
    const isGuild = 'guild' in props && props.guild !== undefined;
    const isBlocked = (
      (isFolder && Settings.isBlocked(props.folderId)) ||
      (isGuild && Settings.isBlocked(props.guild.id))
    )

    menu.props.children.push(
      buildTextItemElement(
        'danho-block-friend-requests',
        isBlocked ? 'Unblock friend requests' : 'Block friend requests',
        () => {
          Settings.update(cur => ({
            ...cur,
            folderIds: isFolder
              ? isBlocked
                ? cur.folderIds.filter(id => id !== props.folderId)
                : [...cur.folderIds, props.folderId]
              : cur.folderIds,

            guildIds: isGuild
              ? isBlocked
                ? cur.guildIds.filter(id => id !== props.guild.id)
                : [...cur.guildIds, props.guild.id]
              : cur.guildIds,
          }))
        }, 
        { color: 'danger' }
      )
    );
  });
}