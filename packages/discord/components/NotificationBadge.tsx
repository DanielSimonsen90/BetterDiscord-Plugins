import Finder from "@danho-lib/dium/api/finder";

export const NotificationBadge: React.FC<{
  count: number;
  color?: string;
  disableColor?: boolean;
  shape?: string;
  className?: string;
  style?: React.CSSProperties;
}> = Finder.findBySourceStrings('STATUS_DANGER', "numberBadge");
export default NotificationBadge;