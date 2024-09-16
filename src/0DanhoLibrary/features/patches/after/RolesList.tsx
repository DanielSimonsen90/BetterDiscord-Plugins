import { Patcher } from "@dium/api";
import { RolesListModule } from "../../pretty-roles/types";
import { $ } from "@danho-lib/DOM";
import { hexToRgb, RGB, rgbToHex } from "@danho-lib/Utils/Colors";
import { PrettyRolesManager } from "../../pretty-roles/manager";
import { DEFAULT_DISCORD_ROLE_COLOR } from "../../../Settings";

export default function afterRolesList(RolesListModule: RolesListModule) {
  Patcher.after(RolesListModule, 'RolesList', () => {
    $(s => s.role('list', 'div').and.ariaLabelContains('Role')).children().forEach(el => {
      const roleId = el.attr('data-list-item-id')?.split('_').pop();
      if (!roleId) return;

      el.setStyleProperty('--role-color', 
        hexToRgb(PrettyRolesManager.getRole(roleId).colorString 
        ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(',')
      );
    });
  });
}