import { Patcher } from "@dium/api";
import RolesListModule from "@danho-lib/Patcher/RolesList";
import setManagerContext from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/setManagerContext";

export default function insteadRolesList() {
  Patcher.instead(RolesListModule, 'RolesList', (data) => {
    return setManagerContext(data);
  });
}