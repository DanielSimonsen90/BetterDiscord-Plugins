import RolesListModule from "@injections/patched/RolesList";
import { Patcher } from "@dium";

import applyRoleColors from "../../utils/applyRoleColors";
import { ColorfulRolesManager } from "../../utils/ColorfulRolesManager";

export default function afterRolesList() {
  Patcher.after(RolesListModule, 'RolesList', ({ result }) => {
    if (result) ColorfulRolesManager.context = result.props;
    applyRoleColors();
  });
}