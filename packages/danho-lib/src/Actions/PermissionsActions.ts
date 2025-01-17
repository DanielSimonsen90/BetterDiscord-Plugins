import { PermissionOverwrite, Snowflake } from "@discord/types";
import Finder from "../dium/api/finder";

export const PermissionActions = Finder.findBySourceStrings("addRecipient", "clearPermissionOverwrite", "updatePermissionOverwrite", "backupId=493683") as {
  addRecipient: (e: any, t: any, n: any, a: any) => any;
  addRecipients: (e: any, t: any, n: any, a: any, r: any) => any;
  clearPermissionOverwrite: (channelId: Snowflake, userId: Snowflake) => any;
  updatePermissionOverwrite: (channelId: Snowflake, permissionsOverwrite: PermissionOverwrite) => any;
};

export default PermissionActions;