import { React } from "@dium/modules";
import { createLogger, Finder } from '@injections';
import { DiscordTimeFormat } from "@discord/types/time";

const Logger = createLogger("TimestampComponent");

export const getNode = Finder.bySourceStrings<(
  unix: number,
  format: DiscordTimeFormat,
) => object>("timestamp", "format", "parsed", "full", { searchExports: true });
export const Timestamp = Finder.bySourceStrings<React.FC<{
  node: ReturnType<typeof getNode>;
}>, true>(".timestampTooltip", { module: true, }).Z;

type Props = {
  unix: number;

  /**
   * @t SHORT_TIME: HH:mm
   * @T LONG_TIME: HH:mm:ss
   * @d SHORT_DATE: dd/MM/yyyy
   * @D LONG_DATE: dd Month yyyy
   * @f SHORT_DATE/TIME: dd Month yyyy HH:mm
   * @F LONG_DATE/TIME: Day, dd Month yyyy HH:mm
   * @R RELATIVE: <x> <unit> ago | in <x> <unit>
   */
  format: DiscordTimeFormat;
};

export default function TimestampComponent({ unix, format }: Props) {
  if (isNaN(unix)) {
    Logger.error("TimestampComponent: Invalid unix timestamp", { unix, format });
    return null;
  }

  const node = getNode(unix, format);
  const BadTimestamp = <p>{new Date(unix * 1000).toLocaleString()}</p>;

  try {
    return typeof Timestamp === 'function' ? <Timestamp node={node} /> : BadTimestamp;
  } catch (e) {
    console.error(e);
    return BadTimestamp;
  }
}