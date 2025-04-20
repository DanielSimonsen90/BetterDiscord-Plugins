import { UserStatus as UserStatusType } from '@discord/types';
import { Finder } from '@injections';
import { MemoExoticComponent, FunctionComponent } from '@react';

export const UserAvatar: MemoExoticComponent<FunctionComponent<{
  src: string;
  status: UserStatusType;
  size: `SIZE_32`;
  
  statusColor?: string;
  isMobile?: boolean;
  isTyping?: boolean;
  typingIndicatorRef?: any;
  isSpeaking?: boolean;
  statusTooltip?: boolean;
  statusTooltipDelay?: number;
  statusBackdropColor?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  imageClassName?: string;

}>> = Finder.bySourceStrings("statusColor", "status", "fromStatus");
export default UserAvatar;