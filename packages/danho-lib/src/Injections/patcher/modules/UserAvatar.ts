import Finder from "../../finder";
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

export const UserAvatar = Finder.bySourceStrings("src", "status", "isMobile", "isSpeaking", { module: true, multiple: true })[1] as Record<'qE', UserAvatar>;
export default UserAvatar;