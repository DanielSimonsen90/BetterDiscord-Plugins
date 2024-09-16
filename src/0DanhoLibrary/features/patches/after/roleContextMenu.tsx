import { Patcher } from "@dium/api";
import { MenuGroup, MenuItem } from '@dium/components/menu';
import { React } from "@dium/modules";
import { PrettyRolesManager } from "../../pretty-roles";

export default function afterRoleContextMenu() {
  Patcher.contextMenu('dev-context', result => {
    if (!PrettyRolesManager.context) return result;
    else if (!PrettyRolesManager.context.canManageRoles) return result;

    const roleId = result.props.children.props.id.split('-').pop();
    const role = PrettyRolesManager.context.roles.find(r => r.id === roleId);

    result.props.children = [<MenuGroup>
        <MenuItem color='danger'
          id="pretty-roles__remove-role"
          label={`Remove role`}
          action={() => {
            PrettyRolesManager.context.onRemoveRole(role);
          }}
        />
      </MenuGroup>,
      result.props.children, 
    ];
    return result;
  });
}