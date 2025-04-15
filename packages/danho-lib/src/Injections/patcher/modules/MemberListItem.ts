import { Activity, Channel, Snowflake, User, UserStatus } from "@discord/types";
import { AvatarWithTextBD } from "@discord/components";
import Finder from "../../finder";

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
  children: ReturnType<AvatarWithTextBD['render']>;
  renderPopout(e: any): void;
}>>;

export const MemberListItem: MemberListItem = Finder.bySourceStrings("ownerTooltipText", "onClickPremiumGuildIcon:", { module: true });
export default MemberListItem;