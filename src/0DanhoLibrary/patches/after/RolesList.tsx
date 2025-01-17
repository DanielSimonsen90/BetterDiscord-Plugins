import { Patcher } from "@dium/api";
import RolesListModule from "@danho-lib/Patcher/RolesList";
import prettifyRoles from "src/0DanhoLibrary/features/style-changes/pretty-roles/patches/prettifyRoles";
import { Settings } from "src/0DanhoLibrary/Settings";

export default function afterRolesList() {
  if (!Settings.current.prettyRoles) return;

  Patcher.after(RolesListModule, 'RolesList', () => {
    if (Settings.current.prettyRoles) prettifyRoles();
  });
}