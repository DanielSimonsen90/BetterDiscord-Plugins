import type { Snowflake } from "@discord/types/base";
import { Finder } from "@dium/api";

type Identity = {
    avatar: string;
    banner: string;
    bio: string;
    nickname: string;
    pronouns: string;
}

export type GuildIdentyStore = {
    clearErrors(): void;
    closeGuildIdentitySettings(): void;
    initGuildIdentitySettings(guildId: Snowflake, analyricsLocation: any): void;
    openGuildIdentitySettings(guildId: Snowflake, source: string, analyricsLocation: any): void;

    resetAllPending(): void;
    resetAndCloseGuildIdentityForm(): void;
    resetPendingMemberChanges(): void;
    resetPendingProfileChanges(): void;

    saveGuildIdentityChanges(guildId: Snowflake, changes: Partial<Identity>): Identity | any;

    setCurrentGuild(guildId: Snowflake): void;
    setDisableSubmit(value: boolean): void;
    setPendingAvatar(url: string): void;
    setPendingBanner(url: string): void;
    setPendingBio(bio: string): void;
    setPendingNickname(nickname: string): void;
    setPendingPronouns(pronouns: string): void;
}
export const GuildIdentyStore: GuildIdentyStore = Finder.byKeys(["saveGuildIdentityChanges"]);
export default GuildIdentyStore;