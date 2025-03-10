import { React } from "@dium/modules";
import Finder from "@danho-lib/dium/api/finder";
import { DiscordTimeFormat } from "@discord/types/time";

export const getNode = Finder.findBySourceStrings("timestamp", "format", "parsed", "full", { searchExports: true }) as (
  unix: number,
  format: DiscordTimeFormat,
) => object;
export const Timestamp = Finder.findBySourceStrings("timestampTooltip", { defaultExport: false, }).Z as React.FC<{
  node: ReturnType<typeof getNode>;
}>;

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
}
export default function TimestampComponent({ unix, format }: Props) {
  const node = getNode(unix, format);
  try {
    return <Timestamp node={node} />;
  } catch (e) {
    console.error(e);
    return <p>{
      new Date(unix * 1000).toLocaleString()
    }</p>;
  }
}