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
import { Guild } from "@discord/types/guild";
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

  getMembers(guild) {
    return GuildMemberStore.getMembers(guild);
  },
};