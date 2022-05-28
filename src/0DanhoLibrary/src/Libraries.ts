import ZLibrary from "@ZLibrary";
import BDFDB from "@BDFDB";

export type Libraries = {
    ZLibrary: typeof ZLibrary,
    BDFDB: BDFDB
}

export const Libraries = {
    ZLibrary,
    BDFDB: window.BDFDB
};

