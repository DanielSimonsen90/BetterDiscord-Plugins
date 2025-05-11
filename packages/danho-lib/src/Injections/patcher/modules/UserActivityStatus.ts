import { Activity } from "@discord/types";
import Finder from "../../finder";

export type UserActivityStatus = React.JSX.BD.FC<{
  activity: Activity;
  hideIcon: boolean;
  hideText: boolean;
  textClassName: 'text__...';
  textVairant: 'text-sm/medium';
}, {
  children: [
    icon: React.JSX.BD.Rendered<{
      icon: (e: any) => React.JSX.BD.Rendered<unknown>;
      tooltip: undefined;
    }>,
    text: React.JSX.BD.Rendered<{
      children: Array<React.JSX.BD.Rendered<any> | string>;
      className: 'text__...',
      variant: 'text-sm/medium';
    }>,
  ];
}>;

export const UserActivityStatus = Finder.bySourceStrings<UserActivityStatus, true>("PresenceActivityStatus", "textVariant", { module: true });
export default UserActivityStatus;