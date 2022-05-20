import * as discordium from "discordium";
import * as DevFinder from "./finder";
import config from "./config.json";

declare global {
    interface Window {
        dium?: typeof discordium;
    }
}

// add finder extension
const {Finder} = discordium;
(Finder as any).dev = DevFinder;

export default discordium.createPlugin(config, () => ({
    start() {
        // expose as global
        window.dium = discordium;
    },
    stop() {
        // remove global
        delete window.dium;
    }
}));
