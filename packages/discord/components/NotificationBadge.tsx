import { Finder } from '@injections';

export const NotificationBadge: React.FC<{
  count: number;
  color?: string;
  disableColor?: boolean;
  shape?: string;
  className?: string;
  style?: React.CSSProperties;
}> = Finder.bySourceStrings('STATUS_DANGER', "numberBadge");
export default NotificationBadge;