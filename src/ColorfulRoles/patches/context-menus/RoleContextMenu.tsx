import { React } from "@react";
import { Patcher } from "@dium/api";
import { MenuGroup, MenuItem } from '@dium/components/menu';
import { ColorfulRolesManager } from "../../utils/ColorfulRolesManager";

export default function afterRoleContextMenu() {
  Patcher.contextMenu('dev-context', result => {
    if (!ColorfulRolesManager.context) return result;
    const roleId = result.props.children.props.id.split('-').pop();
    const role = ColorfulRolesManager.getRole(roleId);

    ColorfulRolesManager.role = role;
    if (!ColorfulRolesManager.canRemoveRole()) return result;

    result.props.children = [
      <MenuGroup>
        <MenuItem color='danger'
          id="danho-colorful-roles__remove-role"
          label='Remove role'
          action={() => {
            ColorfulRolesManager.removeRole();
          }}
        />
      </MenuGroup>,
      result.props.children,
    ];

    return result;
  });
}