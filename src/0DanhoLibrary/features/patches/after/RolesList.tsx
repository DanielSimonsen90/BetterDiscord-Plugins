import { Patcher } from "@dium/api";
import { RolesListModule } from "../../pretty-roles/types";
import { $ } from "@danho-lib/DOM";
import { hexToRgb, RGB, rgbToHex } from "@danho-lib/Utils/Colors";
import { PrettyRolesManager } from "../../pretty-roles/manager";
import { Settings } from "../../../Settings/Settings";
import { DEFAULT_DISCORD_ROLE_COLOR } from "../../../constants";

export default function afterRolesList(RolesListModule: RolesListModule) {
  Patcher.after(RolesListModule, 'RolesList', () => {
    $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
      const roleId = el.attr('data-list-item-id')?.split('_').pop();
      if (!roleId) return;

      const role = PrettyRolesManager.getRole(roleId);
      el.setStyleProperty('--role-color', 
        hexToRgb(role.colorString 
        ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(',')
      );

      if (Settings.current.groupRoles) {
        const isGroupRole = role.name.toLowerCase().includes('roles');
        if (isGroupRole) el.addClass('danho-library__pretty-roles__group-role');
      }
    });
  });
}