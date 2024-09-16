import { Snowflake } from '@discord/types/base';
import { Role } from '@discord/types/guild/role';
import { RolesListModule } from './types';

export const PrettyRolesManager = new class PrettyRolesManager {
  context: ReturnType<RolesListModule['RolesList']>['props']['children']['props'];
  role: Role;

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
};