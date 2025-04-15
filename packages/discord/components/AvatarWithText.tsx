import Finder from "@danho-lib/dium/api/finder";
import { ClassNamesUtils } from "@danho-lib/Utils";
import { ForwardRefExoticComponent, ReactNode } from "@react";

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

export const AvatarWithText: AvatarWithText = Finder.findBySourceStrings("AvatarWithText");
export default AvatarWithText;

export const AvatarWithTextClassNameModule = ClassNamesUtils.combineModuleByKeys<(
  | 'avatarWithText'
  | 'link'
)>(["avatarWithText"])