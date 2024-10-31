import {
  GuildStore,
  GuildMemberStore,
  GuildChannelStore,
  GuildEmojiStore,
  SelectedGuildStore,
  VoiceStore,
  
  UserStore
} from '@stores';

import GuildActions from "@actions/GuildActions";
import { Guild, Role } from "@discord/types/guild";
import { GuildMember } from "@discord/types/guild/member";

import { BetterOmit, FilterStore } from "./types";
import { Snowflake } from "@discord/types/base";

type CompiledGuildUtils = BetterOmit<
  & FilterStore<GuildStore>
  & FilterStore<GuildMemberStore>
  & FilterStore<GuildChannelStore>
  & FilterStore<GuildEmojiStore>
  & FilterStore<SelectedGuildStore>
  & FilterStore<VoiceStore>

  & typeof GuildActions
  , '__getLocalVars' | 'getState'> & {
    get current(): Guild | null;
    get me(): GuildMember | null;

    meFor(guildId: Snowflake): GuildMember;
    getSelectedGuildTimestamps(): ReturnType<SelectedGuildStore['getState']>["selectedGuildTimestampMillis"];
    getIconUrl(guild: Guild): string;
    getGuildByName(name: string): Guild | null;
    getGuildRoleWithoutGuildId(roleId: Snowflake): Role | null;
    getEmojiIcon(emojiId: Snowflake, size?: number): string;
  };

export const GuildUtils: CompiledGuildUtils = {
  ...GuildStore,
  ...GuildMemberStore,
  ...GuildChannelStore,
  ...GuildEmojiStore,
  ...SelectedGuildStore,
  ...VoiceStore,

  ...GuildActions,

  get current() {
    return GuildStore.getGuild(SelectedGuildStore.getGuildId());
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
  getIconUrl(guild) {
    return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png';
  },
  getEmojiIcon(emojiId, size = 128) {
    return `https://cdn.discordapp.com/emojis/${emojiId}.webp?size=${size}&quality=lossless`;
  },

  getMembers(guild) {
    return GuildMemberStore.getMembers(guild);
  },
  getGuildByName(name) {
    return Object.values(GuildStore.getGuilds()).find(guild => guild.name === name) || null;
  },
  getGuildRoleWithoutGuildId(roleId) {
    const allGuildsRoles = GuildStore.getAllGuildsRoles();
    for (const guildId in allGuildsRoles) {
      if (allGuildsRoles[guildId][roleId]) {
        return allGuildsRoles[guildId][roleId];
      }
    }
    return null;
  },
};