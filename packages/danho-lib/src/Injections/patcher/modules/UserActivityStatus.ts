import { Activity } from "@discord/types";
import Finder from "../../finder";

export type UserActivityStatus = JSX.BD.FC<{
  activity: Activity;
  hideIcon: boolean;
  hideText: boolean;
  textClassName: 'text__...';
  textVairant: 'text-sm/medium';
}, {
  children: [
    icon: JSX.BD.Rendered<{
      icon: (e: any) => JSX.BD.Rendered<unknown>;
      tooltip: undefined;
    }>,
    text: JSX.BD.Rendered<{
      children: Array<JSX.BD.Rendered<any> | string>;
      className: 'text__...',
      variant: 'text-sm/medium';
    }>,
  ];
}>;

export const UserActivityStatus = Finder.bySourceStrings<UserActivityStatus, true>("PresenceActivityStatus", "textVariant", { module: true });
export default UserActivityStatus;