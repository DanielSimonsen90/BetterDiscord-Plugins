import { Guild } from "@discord/types";
import { Finder } from "@injections";

export const useGuildFeatures = Finder.bySourceStrings<(guild: Guild) => Array<string>>("hasFeature", "GUILD_SCHEDULED_EVENTS");
