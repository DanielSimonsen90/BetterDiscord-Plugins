import { Patcher } from "@dium/api";
import RolesListModule from "@danho-lib/Patcher/RolesList";
import setManagerContext from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/setManagerContext";
import { Settings } from "src/0DanhoLibrary/Settings";

export default function insteadRolesList() {
  if (!Settings.current.prettyRoles) return;

  Patcher.instead(RolesListModule, 'RolesList', (data) => {
    if (Settings.current.prettyRoles) return setManagerContext(data);
    
    return data.original(...data.args);
  });
}