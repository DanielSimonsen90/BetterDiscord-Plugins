import { ForwardRefExoticComponent, ReactNode } from "@react";
import { Finder } from "@injections";
import { ClassNamesUtils } from "@utils";
import { PropsFromFC } from "@utils/types";
import { UserStatus } from "@discord/types";

export type AvatarWithText = ForwardRefExoticComponent<{
  selected?: boolean;
  muted?: boolean;
  highlighted?: boolean;
  wrapContent?: boolean;
  avatar: React.JSX.Element;
  decorators?: unknown;
  name: ReactNode;
  subText?: ReactNode;
  avatarClassName?: string;
  innerClassName?: string;
}>;

export const AvatarWithText = Finder.bySourceStrings<AvatarWithText>("AvatarWithText");

export type AvatarWithTextBD = React.JSX.BD.FRC<PropsFromFC<AvatarWithText>, {
  children: [
    avatar: React.JSX.BD.Rendered<{
      className: 'avatar__...';
      children: Avatar;
    }>,
    content: [
      nameAndDecorators: React.JSX.BD.Rendered<{
        name: React.JSX.BD.Rendered<{
          className: 'name__...';
          children: Name;
        }>,
        decoration: null;
      }>,
      subText: React.JSX.BD.Rendered<{
        className: 'subtext__...';
        children: React.JSX.BD.Rendered<{
          children: string;
          className: 'subtext__...';
        }>;
      }>,
    ]
  ];
}>;
export const AvatarWithTextBD = Finder.bySourceStrings<AvatarWithTextBD>("AvatarWithText");
export default AvatarWithText;

export const AvatarWithTextClassNameModule = ClassNamesUtils.combineModuleByKeys<(
  | 'avatarWithText'
  | 'link'
)>(["avatarWithText"]);

type Avatar = React.JSX.BD.Rendered<{
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

type Name = React.JSX.BD.Rendered<{
  children: string;
  tooltipClassName: `overflowtooltip__...`;
}>;