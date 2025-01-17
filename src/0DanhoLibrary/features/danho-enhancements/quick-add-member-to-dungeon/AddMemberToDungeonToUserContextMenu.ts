import { Callback } from '@danho-lib/ContextMenus/UserContextMenu'
import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";

import { PermissionOverwrite, Snowflake } from "@discord/types";
import { UserStore, GuildStore, GuildMemberStore, GuildChannelStore } from "@stores";
import { PermissionActions } from '@actions';

import { DEADLY_NINJA_ID, DUNGEON_ID } from './constants'
import { hasPermission } from './functions';

const patched: Callback = function(menu, props) {
  const isGuildContextMenu = !!props.guildId;
  if (!isGuildContextMenu) return menu;

  const guild = GuildStore.getGuild(props.guildId);
  if (guild.id !== DEADLY_NINJA_ID) return menu;

  const memberIds = GuildMemberStore.getMemberIds(guild.id);
  const dungeon = GuildChannelStore.getChannels(guild.id).VOCAL.find(stored => stored.channel.id === DUNGEON_ID)?.channel;
  if (!dungeon) return menu;

  const accessPermission = dungeon.accessPermission ?? 1049600n;
  if (typeof accessPermission !== "bigint") {
    console.error("Invalid accessPermission value", accessPermission);
    return menu;
  }
  const permittedUsers = memberIds
    .map(UserStore.getUser)
    .filter(Boolean)
    .filter(user => hasPermission(dungeon, user.id, accessPermission));
  if (!permittedUsers.length) return menu;

  const hasAccess = permittedUsers.some(user => user.id === props.user.id);
  const allow = (userId: Snowflake) => ({
    allow: accessPermission,
    deny: 0n,
    id: userId,
    type: 1,
  }) as PermissionOverwrite;

  menu.props.children[0].props.children[5].props.children.push(buildTextItemElement(
    hasAccess ? "remove-from-dungeon" : "add-to-dungeon",
    hasAccess ? "Remove from Dungeon" : "Add to Dungeon",
    () => {
      if (hasAccess) PermissionActions.clearPermissionOverwrite(DUNGEON_ID, props.user.id);
      else PermissionActions.updatePermissionOverwrite(DUNGEON_ID, allow(props.user.id));
    }
  ) as never);
}

export default patched