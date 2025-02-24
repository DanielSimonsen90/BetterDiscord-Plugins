import Finder from "@danho-lib/dium/api/finder";
import { UserStatus } from "@discord/types";

export type UserAvatar = JSX.BD.FC<{
  'aria-label': string;
  className: 'avatar_...';
  isMobile: boolean;
  size: 'SIZE_24';
  src: string;
  status: UserStatus;
}, {
  'aria-label': string;
  ariaHidden: boolean;
  children: JSX.BD.Rendered;
  className: 'avatar_...';
  isMobile: boolean;
  size: 'SIZE_24';
  specs: {
    size: 24;
    status: number;
    stroke: number;
    offset: number;
  },
  src: string;
  status: UserStatus;
  typingOffset: number;
}>
export const UserAvatar: Record<'qE', UserAvatar> = Finder.findBySourceStrings("src", "status", "isMobile", "isSpeaking", 'showMultiple=true', { defaultExport: false })[1];
export default UserAvatar;