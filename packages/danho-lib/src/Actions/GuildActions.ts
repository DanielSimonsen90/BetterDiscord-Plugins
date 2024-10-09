import type { PresenceStoreState } from "@danho-lib/Stores";
import type { Snowflake } from "@discord/types/base";
import type { Channel } from "@discord/types/channel";
import type { Guild } from "@discord/types/guild";
import type { Role } from "@discord/types/guild/role";

import { Finder } from "@dium/api";
import type { Arrayable } from "../Utils/types";

export interface GuildActions {
    addGuild(name: string, icon: string, channels: Array<Channel>, systemChannelId: Snowflake): Guild;
    /** @assumed */
    assignGuildRoleConnection(guildId: Snowflake, roleId: Snowflake): void;
    banUser(guildId: Snowflake, userId: Snowflake, deleteMessageSeconds?: number, reason?: string): void;
    batchChannelUpdate(channelId: Snowflake, update: Channel): void;
    batchRoleUpdate(roleId: Snowflake, update: Role): void;
    collapseAllFolders(): void;
    createGuild(guild: Guild): void;
    createRole(role: Role): void;
    createRoleWithNameColor(roleId: Snowflake, name?: string, color?: string): void;
    deleteGuild(guildId: Snowflake): void;
    deleteRole(roleId: Snowflake): void;
    escapeToDefaultChannel(guildId: Snowflake): void;
    fetchApplications(guildId: Snowflake, channelId: Snowflake): void;
    fetchGuildBans(guildId: Snowflake): void;
    fetchGuildRoleConnectionsEligibility(guildId: Snowflake): void;
    joinGuild(guildId: Snowflake, lurking: {
        source: any,
        loadId: String,
        lurkLocation: Channel,
    }): void;
    kickUser(guildId: Snowflake, userId: Snowflake, reason?: string): void;
    move(fromIndex: number, toIndex: number, fromFolderIndex: number, toFolderIndex: number): void;
    moveById(sourceId: string, targetId: string, moveToBelow: boolean, combine: boolean): void;
    nsfwAgree(guildId: Snowflake): void;
    nsfwReturnToSafety(guildId: Snowflake): void;
    requestMembers(guildIds: Arrayable<Snowflake>, query: string, limit: number, presences: Array<PresenceStoreState>): void;
    requestMembersById(guildIds: Arrayable<Snowflake>, userIds: Arrayable<Snowflake>, presences: Array<PresenceStoreState>): void;
    selectGuild(guildId: Snowflake): void;
    setChannel(guildID: Snowflake, userId: Snowflake, channelId: Snowflake): void;
    setCommunicationDisabledUntil(guildId: Snowflake, userId: Snowflake, communicationDisabledUntil: Date, duration?: number, reason?: string): void;
    setGuildFolderExpanded(folderId: string, expanded: boolean): void;
    setServerDeaf(guildId: Snowflake, userId: Snowflake, deaf: boolean): void;
    setServerMute(guildId: Snowflake, userId: Snowflake, mute: boolean): void;
    toggleGuildFolderExpanded(folderId: string): void;
    transitionToGuildSync(guildId: Snowflake, t?: { welcomeModalChannelId?: Snowflake }, n?: { welcomeModalChannelId?: Snowflake }, r?: any): void;
    unbanUser(guildId: Snowflake, userId: Snowflake): void;
    updateRole(guildId: Snowflake, roleId: Snowflake, update: Role): void;
    updateRolePermissions(guildId: Snowflake, roleId: Snowflake, permissions: Array<bigint>): void;
}
export const GuildActions: GuildActions = Finder.byKeys(["requestMembers"]);
export default GuildActions;