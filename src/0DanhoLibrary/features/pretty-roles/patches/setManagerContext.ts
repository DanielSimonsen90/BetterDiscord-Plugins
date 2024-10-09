import createPatcherCallback from "@danho-lib/Patcher/CreatePatcherCallback";
import RolesListModule from "@danho-lib/Patcher/RolesList";

import { PrettyRolesManager } from "../manager";

export default createPatcherCallback<RolesListModule['RolesList']>(({ args, original }) => {
  const result = original(...args);
  PrettyRolesManager.context = result.props;
  return result;
});