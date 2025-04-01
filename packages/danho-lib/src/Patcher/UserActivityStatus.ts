import Finder from "@danho-lib/dium/api/finder";
import { Activity } from "@discord/types";

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

export const UserActivityStatus: Record<'Z', UserActivityStatus> = Finder.findBySourceStrings("PresenceActivityStatus", "textVariant", { defaultExport: false });
export default UserActivityStatus;