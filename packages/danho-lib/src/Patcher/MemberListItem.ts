import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";

export type MemberListItem = Record<'Z', JSX.BD.FCF<{
  guildId: Snowflake;
}>>;

export const MemberListItem: MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false });
export default MemberListItem;