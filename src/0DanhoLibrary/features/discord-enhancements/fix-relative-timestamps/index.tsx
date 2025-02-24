import Finder from "@danho-lib/dium/api/finder";
import { DiscordTimeFormat } from "@discord/types";
import { Logger, Patcher } from "@dium";
import * as TimeUtils from '@danho-lib/Utils/Time';

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
    
    if (diff < 0) return result;
    if (diff < TimeUtils.MINUTE) return 'just now';
    if (diff < TimeUtils.HOUR) return `${Math.floor(diff / TimeUtils.MINUTE)} minutes ago`; 
    if (diff < TimeUtils.DAY) return `${Math.floor(diff / TimeUtils.HOUR)} hours ago`;
    if (diff < TimeUtils.WEEK) return `${Math.floor(diff / TimeUtils.DAY)} days ago`;
    if (diff < TimeUtils.MONTH) return `${Math.floor(diff / TimeUtils.WEEK)} weeks ago`;
    if (diff < TimeUtils.YEAR) return `${Math.floor(diff / TimeUtils.MONTH)} months ago`;
    return `${Math.floor(diff / TimeUtils.YEAR)} years ago`;
  })
}