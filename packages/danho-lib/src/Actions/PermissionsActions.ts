import { PermissionOverwrite, Snowflake } from "@discord/types";
import Finder from "../Injections/finder";

export const PermissionActions = Finder.bySourceStrings<{
  addRecipient: (e: any, t: any, n: any, a: any) => any;
  addRecipients: (e: any, t: any, n: any, a: any, r: any) => any;
  clearPermissionOverwrite: (channelId: Snowflake, userId: Snowflake) => any;
  updatePermissionOverwrite: (channelId: Snowflake, permissionsOverwrite: PermissionOverwrite) => any;
}>("addRecipient", "clearPermissionOverwrite", "updatePermissionOverwrite", "backupId=493683");

export default PermissionActions;