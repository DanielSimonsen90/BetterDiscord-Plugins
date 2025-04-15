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
  avatar: JSX.Element;
  decorators?: unknown;
  name: ReactNode;
  subText?: ReactNode;
  avatarClassName?: string;
  innerClassName?: string;
}>;

export const AvatarWithText = Finder.bySourceStrings<AvatarWithText>("AvatarWithText");

export type AvatarWithTextBD = JSX.BD.FRC<PropsFromFC<AvatarWithText>, {
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

type Name = JSX.BD.Rendered<{
  children: string;
  tooltipClassName: `overflowtooltip__...`;
}>;