import { Activity, Channel, User } from "@discord/types";
import { Finder } from "@injections";
import { FunctionComponent } from "@react";

type Props = {
  activities: Array<Activity> 
  animate?: boolean;
  applicationStream?: null;
  hasQuest?: boolean;
  hideTooltip?: boolean;
  hideEmoji?: boolean;
  textClassName?: string;
  user: User;
  voiceChannel?: unknown | null;
}

export const UserActivity: FunctionComponent<Props> = Finder.bySourceStrings("CUSTOM_STATUS", "activities", "isBlockedOrIgnored");
export default UserActivity;