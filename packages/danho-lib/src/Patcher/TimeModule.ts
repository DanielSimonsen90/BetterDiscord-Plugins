import Finder from "@danho-lib/dium/api/finder";
import { DiscordTimeFormat } from "@discord/types";

type TimeModuleArgs = {
  format: DiscordTimeFormat;
  formatted: string;
  full: string;
  parsed: moment.Moment;
  timestamp: number;
}

type RelativeTimeModule = {
  Z: (args: TimeModuleArgs) => string;
}

export const RelativeTimeModule = Finder.findBySourceStrings<RelativeTimeModule>('"R"!==e.format', { defaultExport: false });
export default RelativeTimeModule;