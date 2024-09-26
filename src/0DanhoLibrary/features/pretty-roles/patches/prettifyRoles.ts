import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import RolesListModule from "@danho-lib/Patcher/RolesList";
import { $ } from "@danho-lib/DOM";
import { hexToRgb, RGB, rgbToHex } from "@danho-lib/Utils/Colors";

import { DEFAULT_DISCORD_ROLE_COLOR } from "src/0DanhoLibrary/constants";
import { PrettyRolesManager } from "src/0DanhoLibrary/features/pretty-roles/manager";
import { Settings } from "src/0DanhoLibrary/Settings";

export default createPatcherAfterCallback<RolesListModule['RolesList']>(() => {
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