import { BetterOmit } from "danholibraryjs";

import {
  GuildStore,
  GuildMemberStore,
  GuildChannelStore,
  GuildEmojiStore,
  SelectedGuildStore,
  VoiceInfo,
  VoiceStore,
  UserStore
} from '@stores/index';

import GuildActions from "@actions/GuildActions";
import { Guild } from "@discord/types/guild";
import { GuildMember } from "@discord/types/guild/member";

import { FilterStore } from "./types";
import { Snowflake } from "@discord/types/base";

type CompiledGuildUtils = BetterOmit<
  & FilterStore<GuildStore>
  & FilterStore<GuildMemberStore>
  & FilterStore<GuildChannelStore>
  & FilterStore<GuildEmojiStore>
  & FilterStore<SelectedGuildStore>
  & FilterStore<VoiceInfo>
  & FilterStore<VoiceStore>

  & typeof GuildActions
  , '__getLocalVars' | 'getState'> & {
    get current(): Guild | null;
    get member(): GuildMember | null;

    meFor(guildId: Snowflake): GuildMember;
    getSelectedGuildTimestamps(): ReturnType<SelectedGuildStore['getState']>["selectedGuildTimestampMillis"];
    getIconUrl(guild: Guild): string;
  };

export const GuildUtils: CompiledGuildUtils = {
  ...GuildStore,
  ...GuildMemberStore,
  ...GuildChannelStore,
  ...GuildEmojiStore,
  ...SelectedGuildStore,
  ...VoiceInfo,
  ...VoiceStore,

  ...GuildActions,

  get current() {
    return GuildStore.getGuild(SelectedGuildStore.getGuildId());
  },
  get me() {
    return GuildMemberStore.getMember(SelectedGuildStore.getGuildId(), UserStore.getCurrentUser().id);
  },

  meFor(guildId: Snowflake) {
    return GuildMemberStore.getMember(guildId, UserStore.getCurrentUser().id);
  },
  getSelectedGuildTimestamps() {
    return SelectedGuildStore.getState().selectedGuildTimestampMillis;
  },
  getIconUrl(guild) {
    return guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png';
  },

  getMembers(guild) {
    return GuildMemberStore.getMembers(guild);
  },
};