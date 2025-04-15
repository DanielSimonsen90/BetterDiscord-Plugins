import { DiscordTimeFormat } from "@discord/types";
import Finder from "../../finder";

type TimeModuleArgs = {
  format: DiscordTimeFormat;
  formatted: string;
  full: string;
  parsed: moment.Moment;
  timestamp: number;
}

export const RelativeTimeModule = Finder.bySourceStrings<(args: TimeModuleArgs) => string, true>('"R"!==e.format', { module: true });
export default RelativeTimeModule;