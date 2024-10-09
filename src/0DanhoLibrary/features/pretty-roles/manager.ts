import RolesListModule from '@danho-lib/Patcher/RolesList';
import type { Snowflake, Role } from '@discord/types';

export const PrettyRolesManager = new class PrettyRolesManager {
  context: ReturnType<RolesListModule['RolesList']>['props'];
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
    return this.context.guild.ownerId === this.context.currentUser.id 
    || (this.context.canManageRoles && this.context.highestRole.id !== this.role.id);
  }
};