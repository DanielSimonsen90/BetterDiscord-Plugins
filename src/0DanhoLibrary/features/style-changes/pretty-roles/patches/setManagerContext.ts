import createPatcherCallback from "@danho-lib/Patcher/CreatePatcherCallback";
import RolesListModule from "@danho-lib/Patcher/RolesList";

import { PrettyRolesManager } from "../manager";

export default createPatcherCallback<RolesListModule['RolesList']>(({ args, original }) => { 
  const result = (original as any).__originalFunction(...args) as ReturnType<typeof original>;
  PrettyRolesManager.context = result.props;
  return result;
});