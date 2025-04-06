import {
  GuildStore,
  GuildMemberStore,
  GuildChannelStore,
  GuildEmojiStore,
  SelectedGuildStore,
  VoiceStore,
  
  UserStore,
  MessageStore
} from '@stores';

import GuildActions from "@actions/GuildActions";
import { Guild, Role } from "@discord/types/guild";
import { GuildMember } from "@discord/types/guild/member";

import { BetterOmit, FilterStore } from "./types";
import { Snowflake } from "@discord/types/base";
import Finder from '@danho-lib/dium/api/finder';
import { User } from '@discord/types';
import { ActionsEmitter } from '@actions';
import { ChannelUtils } from './Channels';
import UserUtils from './Users';

const useGuildFeatures = Finder.findBySourceStrings("hasFeature", "GUILD_SCHEDULED_EVENTS") as (guild: Guild) => Array<string>;

type CompiledGuildUtils = BetterOmit<
  & FilterStore<GuildStore>
  & FilterStore<GuildMemberStore>
  & FilterStore<GuildChannelStore>
  & FilterStore<GuildEmojiStore>
  & FilterStore<SelectedGuildStore>
  & FilterStore<VoiceStore>

  & typeof GuildActions
  , '__getLocalVars' | 'getState'> & {
    useGuildFeatures(guild: Guild): Array<string>;
  } & {
    get current(): Guild | null;
    get currentId(): Snowflake | null;
    get me(): GuildMember | null;

    meFor(guildId: Snowflake): GuildMember;
    getSelectedGuildTimestamps(): ReturnType<SelectedGuildStore['getState']>["selectedGuildTimestampMillis"];
    getIconUrl(guild: Guild): string;
    getGuildByName(name: string): Guild | null;
    getGuildRoleWithoutGuildId(roleId: Snowflake): Role | null;
    getEmojiIcon(emojiId: Snowflake, size?: number): string;
    getMemberAvatar(memberId: Snowflake, guildId: Snowflake, size?: number): string;
    getOwner(guildId?: Snowflake): User | null;
  };

export const GuildUtils: CompiledGuildUtils = {
  ...GuildStore,
  ...GuildMemberStore,
  ...GuildChannelStore,
  ...GuildEmojiStore,
  ...SelectedGuildStore,
  ...VoiceStore,

  ...GuildActions,

  useGuildFeatures(guild) {
    return useGuildFeatures(guild) || [];
  },

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
    return GuildStore.getRole(SelectedGuildStore.getGuildId(), roleId);
  },
  getMemberAvatar(memberId, guildId, size) {
    const avatar = GuildMemberStore.getMember(guildId, memberId).avatar;
    if (avatar) return `https://cdn.discordapp.com/guilds/${guildId}/users/${memberId}/avatars/${avatar}.webp?size=${size}`;
    return 
  },
  getOwner(guildId?: Snowflake, openModal = false, showGuildProfile = true) {
    const guild = guildId ? GuildStore.getGuild(guildId) : GuildUtils.current;
    if (!guild) return null;

    const owner = UserStore.getUser(guild.ownerId);
    if (owner && openModal) UserUtils.openModal(owner.id, showGuildProfile);
    return owner;
  }
};