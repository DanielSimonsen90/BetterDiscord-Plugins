import ZLibrary from "@ZLibrary";
import BDFDB from "@BDFDB";
import * as Discordium from 'discordium';
import * as DanhoDiscordium from 'danho-discordium';

export type Libraries = {
    ZLibrary: typeof ZLibrary,
    BDFDB: BDFDB,
    Discordium: typeof Discordium,
    DanhoDiscordium: typeof DanhoDiscordium,
}

export const Libraries = {
    ZLibrary,
    BDFDB: window.BDFDB,
    Discordium,
    DanhoDiscordium
};

