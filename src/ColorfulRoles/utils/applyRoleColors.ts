import { sleep } from "@dium/utils";

import { Logger } from "@injections";
import { $ } from "@dom";
import { ColorUtils, RGB } from "@utils";

import { ColorfulRolesManager } from "./ColorfulRolesManager";
import { DEFAULT_DISCORD_ROLE_COLOR } from "./constants";
import { Settings } from "../settings";

export default async function applyRoleColors() {
  await sleep(100); // Wait for the roles to load

  $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
    const roleId = el.attr('data-list-item-id')?.split('_').pop();
    if (!roleId) return;

    const role = ColorfulRolesManager.getRole(roleId);
    if (!role) return Logger.warn('Role not found', roleId);

    el.setStyleProperty('--role-color',
      ColorUtils.hexToRgb(role.colorString 
        ??  role.colorStrings?.primaryColor
        ?? ColorUtils.rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(',')
    );

    if (Settings.current.groupRoles) {
      const isGroupRole = role.name.toLowerCase().includes('roles');
      if (isGroupRole) el.addClass('danho-colorful-roles__group-role');
    }
  });
};