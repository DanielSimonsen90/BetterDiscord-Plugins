import { $ } from "@danho-lib/DOM";
import { hexToRgb, RGB, rgbToHex } from "@danho-lib/Utils/Colors";

import { DEFAULT_DISCORD_ROLE_COLOR } from "src/0DanhoLibrary/constants";
import { Settings } from "src/0DanhoLibrary/Settings";
import { PrettyRolesManager } from "../manager";
import { sleep } from "@dium/utils";

export default async function prettyRoles() {
  await sleep(100); // Wait for the roles to load

  $(s => s.role('list', 'div').and.ariaLabelContains('Role'))?.children().forEach(el => {
    const roleId = el.attr('data-list-item-id')?.split('_').pop();
    if (!roleId) return;

    const role = PrettyRolesManager.getRole(roleId);
    if (!role) return console.log('Role not found', roleId);

    el.setStyleProperty('--role-color',
      hexToRgb(role.colorString 
        ??  role.colorStrings?.primaryColor
        ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(',')
    );

    if (Settings.current.groupRoles) {
      const isGroupRole = role.name.toLowerCase().includes('roles');
      if (isGroupRole) el.addClass('danho-library__pretty-roles__group-role');
    }
  });
};