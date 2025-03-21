import Finder from "@danho-lib/dium/api/finder";
import { DiscordTimeFormat } from "@discord/types";
import { Logger, Patcher } from "@dium";
import * as TimeUtils from '@danho-lib/Utils/Time';
import { get } from "http";

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

export default function Feature() {
  const relativeTimeModule = Finder.findBySourceStrings<RelativeTimeModule>('"R"!==e.format', { defaultExport: false });
  if (!relativeTimeModule) return false;

  Patcher.after(relativeTimeModule, 'Z', ({ result, args: [args] }) => {
    if (args.format !== 'R') return result;
    const date = args.parsed.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const getTime = (value: number, time: string) => {
      const result = Math.floor(diff / value);
      return result > 0 ? `${result} ${time}${result > 1 ? 's' : ''} ago` : null;
    };

    return (
      diff < 0 && result
      || getTime(TimeUtils.YEAR, 'year')
      || getTime(TimeUtils.MONTH, 'month')
      || getTime(TimeUtils.WEEK, 'week')
      || getTime(TimeUtils.DAY, 'day')
      || getTime(TimeUtils.HOUR, 'hour')
      || getTime(TimeUtils.MINUTE, 'minute')
      || getTime(TimeUtils.SECOND, 'second')
      || `A long time ago, in a galaxy far, far away... (parsing failed)`
    )
  })
}