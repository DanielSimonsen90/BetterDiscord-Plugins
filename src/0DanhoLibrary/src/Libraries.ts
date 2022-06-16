import ZLibrary from "@ZLibrary";
import BDFDB from "@BDFDB";
import * as Discordium from 'discordium';

export type Libraries = {
    ZLibrary: typeof ZLibrary,
    BDFDB: BDFDB,
    Discordium: typeof Discordium,
}

export const Libraries = {
    ZLibrary,
    BDFDB: window.BDFDB,
    Discordium,
};

