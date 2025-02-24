import Finder from "@danho-lib/dium/api/finder";
import { Activity, Channel, Snowflake, User, UserStatus } from "@discord/types";
import NameTag from "./NameTag";

export type MemberListItem = Record<'Z', JSX.BD.FCF<{
  activities: Array<Activity>;
  channel: Channel;
  colorRoleName: string;
  colorString: `#${string}`;
  currrentUser: User;
  guildId: Snowflake;
  isMobile: boolean;
  isOwner: boolean;
  isTyping: boolean;
  itemProps: Object;
  nick: null | string;
  onClick(e: React.MouseEvent): void;
  onClickPremiumGuildIcon(e: React.MouseEvent): void;
  onContextMenu(e: React.MouseEvent): void;
  onKeyDown(e: React.KeyboardEvent): void;
  onMouseDown(e: React.MouseEvent): void;
  premiumSince: null | Date;
  status: UserStatus;
  user: User;
}, {
  children: ReturnType<NameTag>;
  renderPopout(e: any): void;
}>>;

export const MemberListItem: MemberListItem = Finder.findBySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { defaultExport: false });
export default MemberListItem;