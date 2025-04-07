import RolesListModule from "@danho-lib/Patcher/RolesList";
import { Patcher } from "@dium";
import applyRoleColors from "src/ColorfulRoles/utils/applyRoleColors";
import { ColorfulRolesManager } from "src/ColorfulRoles/utils/ColorfulRolesManager";

export default function afterRolesList() {
  Patcher.after(RolesListModule, 'RolesList', ({ result }) => {
    if (result) ColorfulRolesManager.context = result.props;
    applyRoleColors();
  });
}