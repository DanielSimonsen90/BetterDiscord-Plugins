import { Patcher } from "@dium/api";
import { MenuGroup, MenuItem } from '@dium/components/menu';
import { React } from "@dium/modules";
import { PrettyRolesManager } from "../../pretty-roles/manager";

export default function afterRoleContextMenu() {
  Patcher.contextMenu('dev-context', result => {
    if (!PrettyRolesManager.context) return result;
    const roleId = result.props.children.props.id.split('-').pop();
    const role = PrettyRolesManager.getRole(roleId);

    PrettyRolesManager.role = role;
    if (!PrettyRolesManager.canRemoveRole()) return result;

    result.props.children = [
      <MenuGroup>
        <MenuItem color='danger'
          id="pretty-roles__remove-role"
          label={`Remove role`}
          action={() => {
            PrettyRolesManager.removeRole();
          }}
        />
      </MenuGroup>,
      result.props.children,
    ];
    return result;
  });
}