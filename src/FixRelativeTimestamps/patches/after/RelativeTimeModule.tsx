import { Patcher } from "@dium";
import { RelativeTimeModule } from "@injections/patched/TimeModule";
import { TimeUtils } from "@utils";

export default function afterRelativeTimeModule() {
  Patcher.after(RelativeTimeModule, 'Z', ({ result, args: [args] }) => {
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
  }, { name: 'RelativeTimeModule' })
}