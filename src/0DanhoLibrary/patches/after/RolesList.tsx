import { Patcher } from "@dium/api";
import RolesListModule from "@danho-lib/Patcher/RolesList";
import prettifyRoles from "src/0DanhoLibrary/features/pretty-roles/patches/prettifyRoles";

export default function afterRolesList() {
  Patcher.after(RolesListModule, 'RolesList', (data) => {
    prettifyRoles(data);
  });
}