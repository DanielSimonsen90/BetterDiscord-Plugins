import {
  GuildStore,
  GuildMemberStore,
  SelectedGuildStore,
  SortedGuildStore,

  UserStore,
} from '@discord/stores';
import { Guild, GuildMember, Role, Snowflake, User } from '@discord/types';

import { GuildActions } from "../Actions";

import UserUtils from './User';

export const GuildUtils = {
  ...GuildActions,

  get current() {
    return GuildStore.getGuild(SelectedGuildStore.getGuildId());
  },
  get currentId() {
    return SelectedGuildStore.getGuildId();
  },

  get me() {
    return GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), UserStore.getCurrentUser().id) as any as GuildMember;
  },

  meFor(guildId: Snowflake) {
    return GuildMemberStore.getMember(guildId, UserStore.getCurrentUser().id) as any as GuildMember;
  },
  getSelectedGuildTimestamps() {
    return SelectedGuildStore.getState().selectedGuildTimestampMillis;
  },
  getIconUrl(guild: Guild) {
    return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png';
  },
  getEmojiIcon(emojiId: Snowflake, size: number = 128) {
    return `https://cdn.discordapp.com/emojis/${emojiId}.webp?size=${size}&quality=lossless`;
  },

  getMembers(guildId: Snowflake) {
    return GuildMemberStore.getMembers(guildId);
  },
  getGuildByName(name: string) {
    return Object.values(GuildStore.getGuilds()).find(guild => guild.name === name) || null;
  },
  getGuildRoleWithoutGuildId(roleId: Snowflake) {
    return GuildStore.getRole(SelectedGuildStore.getGuildId(), roleId);
  },
  getMemberAvatar(memberId: Snowflake, guildId: Snowflake, size?: number) {
    const avatar = GuildMemberStore.getMember(guildId, memberId).avatar;
    if (avatar) return `https://cdn.discordapp.com/guilds/${guildId}/users/${memberId}/avatars/${avatar}.webp?size=${size}`;
    return;
  },
  getOwner(guildId?: Snowflake, openModal = false, showGuildProfile = true) {
    const guild = guildId ? GuildStore.getGuild(guildId) : GuildUtils.current;
    if (!guild) return null;

    const owner = UserStore.getUser(guild.ownerId);
    if (owner && openModal) UserUtils.openModal(owner.id, showGuildProfile);
    return owner;
  },
  getSortedGuilds() {
    return SortedGuildStore
      .getFlattenedGuildIds()
      .reduce((acc, guildId) => {
        const guild = GuildStore.getGuild(guildId);
        if (guild) acc[guildId] = guild;
        return acc;
      }, {} as Record<Snowflake, Guild>);
  },
};