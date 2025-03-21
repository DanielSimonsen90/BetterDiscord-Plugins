import { Patcher } from "@dium/api";
import { Settings } from "src/0DanhoLibrary/Settings";
import UserActivityStatus from "@danho-lib/Patcher/UserActivityStatus";
import expandActivityStatusString from 'src/0DanhoLibrary/features/discord-enhancements/expand-activity-status/patchActivityStatusString';

export default function afterRolesList() {
  if (!Settings.current.expandActivityStatus) return;

  Patcher.after(UserActivityStatus, 'Z', (data) => {
    if (Settings.current.expandActivityStatus) expandActivityStatusString(data);
  });
}