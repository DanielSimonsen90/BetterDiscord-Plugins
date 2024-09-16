import { Filters, Finder, Logger, Patcher } from '@dium/api';

import { $ } from '@danho-lib/DOM';

import { DEFAULT_DISCORD_ROLE_COLOR, Settings } from '../../Settings';

import afterRoleContextMenu from '../patches/after/roleContextMenu';
import { RolesListModule } from './types';
import { PrettyRolesManager } from './manager';
import { hexToRgb, RGB, rgbToHex } from '@danho-lib/Utils/Colors';

export { default as styles } from './pretty-roles.scss';

export const isPrettyRolesEnabled = () => Settings.current.prettyRoles;

export default function Feature() {
  if (!isPrettyRolesEnabled()) return;

  const RolesListModule: RolesListModule = Finder.demangle({
    RolesList: Filters.bySource('onAddRole')
  }, null, true);

  Patcher.instead(RolesListModule, 'RolesList', ({ args, original }) => {
    const result = original(...args);
    PrettyRolesManager.context = result.props.children.props;
    return result;
  });
  Patcher.after(RolesListModule, 'RolesList', () => {
    $(s => s.role('list', 'div').and.ariaLabelContains('Role')).children().forEach(el => {
      const roleId = el.attr('data-list-item-id')?.split('_').pop();
      if (!roleId) return;

      el.setStyleProperty('--role-color', hexToRgb(PrettyRolesManager.getRole(roleId).colorString ?? rgbToHex(DEFAULT_DISCORD_ROLE_COLOR.split(',').map(Number) as RGB)).join(','));
    })
  });

  afterRoleContextMenu();
}