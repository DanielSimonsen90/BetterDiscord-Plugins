import { BetterOmit } from "danholibraryjs";
import { FilterStore } from "danho-discordium/Utils";

import BDFDB from "@BDFDB";

import { GuildStore, GuildMemberStore } from "@discordium/modules/guild";
import GuildChannelStore from "danho-discordium/Stores/GuildChannelStore";
import GuildEmojiStore from "@stores/GuildEmojiStore";
import SelectedGuildStore from "@stores/SelectedGuildStore";
import VoiceInfo from "@stores/VoiceInfo";
import VoiceStore from "@stores/VoiceStore";

import GuildActions from "@actions/GuildActions";

type CompiledGuildUtils = BetterOmit<BDFDB["GuildUtils"]
    & FilterStore<GuildStore>
    & FilterStore<GuildMemberStore>
    & FilterStore<BDFDB['LibraryModules']['FolderStore']>
    & FilterStore<GuildChannelStore>
    & FilterStore<GuildEmojiStore>
    & FilterStore<SelectedGuildStore>
    & FilterStore<VoiceInfo>
    & FilterStore<VoiceStore>

    & typeof GuildActions
, '__getLocalVars' | 'getCachedState' | 'getState'> & {
    getSelectedGuildTimestamps(): ReturnType<SelectedGuildStore['getState']>["selectedGuildTimestampMillis"]
}

export const GuildUtils: CompiledGuildUtils = {
    ...window.BDFDB.GuildUtils,
    ...GuildStore,
    ...GuildMemberStore,
    ...window.BDFDB.LibraryModules.FolderStore,
    ...GuildChannelStore,
    ...GuildEmojiStore,
    ...SelectedGuildStore,
    ...VoiceInfo,
    ...VoiceStore,

    ...GuildActions,

    getSelectedGuildTimestamps() {
        return SelectedGuildStore.getState().selectedGuildTimestampMillis;
    },
}