import PatchUserContextMenu from "@danho-lib/ContextMenus/UserContextMenu";
import Finder from "@danho-lib/dium/api/finder";
import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";

import { Channel, PermissionOverwrite, Snowflake } from "@discord/types";
import { UserStore, GuildStore, GuildMemberStore, GuildChannelStore } from "@stores";
import { Settings } from "src/0DanhoLibrary/Settings";

const DEADLY_NINJA_ID: Snowflake = '405763731079823380';
const DUNGEON_ID: Snowflake = '760145289956294716';

export default function Feature() {
  if (!Settings.current.addToDungeon) return;
  
  const permissionActions = Finder.findBySourceStrings("addRecipient", "clearPermissionOverwrite", "updatePermissionOverwrite", "backupId=493683") as {
    addRecipient: (e: any, t: any, n: any, a: any) => any;
    addRecipients: (e: any, t: any, n: any, a: any, r: any) => any;
    clearPermissionOverwrite: (channelId: Snowflake, userId: Snowflake) => any;
    updatePermissionOverwrite: (channelId: Snowflake, permissionsOverwrite: PermissionOverwrite) => any;
  };

  const hasPermission = (channel: Channel, userId: Snowflake, accessPermissions: bigint) => {
    if (!accessPermissions) return false;
    const userPermissions = channel.permissionOverwrites[userId]?.allow ?? 0n;
    return BigInt(userPermissions & accessPermissions) === accessPermissions;
  }

  PatchUserContextMenu((menu, props) => {
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
        if (hasAccess) permissionActions.clearPermissionOverwrite(DUNGEON_ID, props.user.id);
        else permissionActions.updatePermissionOverwrite(DUNGEON_ID, allow(props.user.id));
      }
    ) as never);
  });

}
