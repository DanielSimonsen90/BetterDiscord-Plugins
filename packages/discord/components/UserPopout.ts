import { Snowflake, User } from "@discord/types";
import { Finder } from "@injections";

type Props<Show extends boolean> = {
  user: User;
  guildId: Snowflake;
  roleId: Snowflake;
  position: 'window_center' | 'left';
  spacing: 16 | (number & {});
  onShiftClick?: (e: React.MouseEvent) => void;
  shouldShowStatus?: boolean;
  shouldShowOnHover?: boolean;
  clickTrap: Show;
  shouldShow: Show;
  onRequestClose: () => void;
  children: (e: any) => React.ReactNode;
}

export const UserPopout: React.MemoExoticComponent<React.FC<Props<boolean>>> = Finder.bySourceStrings("userId", "shouldShowOnHover");