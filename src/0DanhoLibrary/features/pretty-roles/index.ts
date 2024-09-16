import { Filters, Finder, Logger, Patcher } from '@dium/api';

import { Settings } from '../../Settings';

import { Role } from '@discord/types/guild/role';
import { User } from '@discord/types/user';
import { Guild } from '@discord/types/guild';
import { GuildMember } from '@discord/types/guild/member';

import afterRoleContextMenu from '../patches/after/roleContextMenu';
import { Snowflake } from '@dium/modules';
import { $ } from '@danho-lib/DOM';
export { default as styles } from './pretty-roles.scss';

export const isPrettyRolesEnabled = () => Settings.current.prettyRoles;

type Fiber<Props> = { props: Props }
type RolesListModule = {
  RolesList: (props: RolesListModule['RolesListProps']) => Fiber<{
    children: Fiber<{
      canManageRoles: boolean;
      currentUser: User;
      guild: Guild;
      guildMember: GuildMember;
      highestRole: Role;
      roles: Role[];
      user: User;
      onAddRole: (role: Role) => void;
      onRemoveRole: (role: Role) => void;
    }>
  }>;
  RolesListProps?: {
    user: User;
    currentUser: User;
    guild: Guild;
  }
}

export const PrettyRolesManager = new class PrettyRolesManager {
  context: ReturnType<RolesListModule['RolesList']>['props']['children']['props']
  role: Role

  getRole(roleId: Snowflake) {
    return this.context.roles.find(r => r.id === roleId);
  }
  removeRole() {
    if (!this.role) return;
    this.context.onRemoveRole(this.role);
  }
  canRemoveRole() {
    if (!this.role) return false;
    return this.context.canManageRoles && this.context.highestRole.id !== this.role.id;
  }
}

export default function Feature() {
  if (!isPrettyRolesEnabled()) return;

  const RolesListModule: RolesListModule = Finder.demangle({
    RolesList: Filters.bySource('onAddRole')
  }, null, true);

  Patcher.instead(RolesListModule, 'RolesList', ({ args, original }) => {
    const result = original(...args);
    Logger.log('RolesList', { args, result });
    
    PrettyRolesManager.context = result.props.children.props;
    return result;
  });
  Patcher.after(RolesListModule, 'RolesList', () => {
    $(s => s.role('list', 'div').and.ariaLabelContains('Role')).children().forEach(el => {
      const roleId = el.attr('data-list-item-id')?.split('_').pop();
      if (!roleId) return;

      const roleColor = (() => {
        const roleColorHex = PrettyRolesManager.getRole(roleId).colorString;
        if (!roleColorHex) return;
        const color = parseInt(roleColorHex.slice(1), 16);
        return `${(color >> 16) & 0xff}, ${(color >> 8) & 0xff}, ${color & 0xff}`;
      })()
      el.setStyleProperty('--role-color', roleColor);
    })
  });

  afterRoleContextMenu();
}