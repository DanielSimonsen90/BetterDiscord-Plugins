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

export default function TimestampComponent({ unix, format }: { unix: number, format: DiscordTimeFormat }) {
  const node = getNode(unix, format);
  return <Timestamp node={node} />;
}