import { sleep } from "@dium/utils";

import { Logger } from "@danho-lib/dium/api/logger";
import { $ } from "@danho-lib/DOM";
import { hexToRgb, RGB, rgbToHex } from "@danho-lib/Utils/Colors";

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
      hexToRgb(role.colorString 
        ??  role.colorStrings?.primaryColor
        ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(',')
    );

    if (Settings.current.groupRoles) {
      const isGroupRole = role.name.toLowerCase().includes('roles');
      if (isGroupRole) el.addClass('danho-colorful-roles__group-role');
    }
  });
};