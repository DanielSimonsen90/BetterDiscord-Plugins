import Finder from "@danho-lib/dium/api/finder";
import { Activity, Channel, User, UserStatus } from "@discord/types";

type Avatar = JSX.BD.Rendered<{
  'aria-label': string;
  avatarDecoration?: string;
  isMobile: boolean;
  isTyping: boolean;
  onMouseEnter(): void;
  onMouseLeave(): void;
  size: `SIZE_32`;
  src?: string;
  status: UserStatus;
  statusTooltip: boolean;
}>

type SubText = JSX.BD.Rendered<{
  activities: Array<Activity>;
  animate: boolean;
  applicationStream: null;
  emojiClassName?: string;
  location: 'PrivateChannel' & (string & {});
  user: User;
  voiceChannel?: Channel;
}>;

type Name = JSX.BD.Rendered<{
  children: string;
  tooltipClassName: `overflowtooltip__...`;
}>

export type NameTag = JSX.BD.FRC<{
  selected: boolean;
  muted?: boolean;
  highlighted?: boolean;
  wrapContent?: boolean;
  avatar: Avatar;
  decorators: Object;
  name: Name;
  subText?: SubText;
  avatarClassName?: string;
  innerClassName?: string;
}, {
  children: [
    avatar: JSX.BD.Rendered<{
      className: 'avatar__...';
      children: Avatar;
    }>,
    content: [
      nameAndDecorators: JSX.BD.Rendered<{
        name: JSX.BD.Rendered<{
          className: 'name__...';
          children: Name;
        }>,
        decoration: null;
      }>,
      subText: JSX.BD.Rendered<{
        className: 'subtext__...';
        children: JSX.BD.Rendered<{
          children: string;
          className: 'subtext__...';
        }>
      }>,
    ]
  ]
}>;

export const NameTag: NameTag = Finder.findBySourceStrings(`nameAndDecorators`, `AvatarWithText`);
export default NameTag;