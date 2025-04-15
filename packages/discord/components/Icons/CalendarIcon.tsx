import { Finder } from '@injections';

type CalendarIconProps = {
  /** @default md */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: number;
  height?: number;
  color?: string;
  colorClass?: string;
};

export const CalendarIcon: React.FC<CalendarIconProps> = Finder.bySourceStrings("M7 1a1 1 0 0 1 1 1v.75c0");
export default CalendarIcon;