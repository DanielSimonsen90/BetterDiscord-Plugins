import RolesListModule from '@danho-lib/Patcher/RolesList';
import { GuildUtils } from '@danho-lib/Utils';
import type { Snowflake, Role } from '@discord/types';

export const ColorfulRolesManager = new class PrettyRolesManager {
  context: ReturnType<RolesListModule['RolesList']>['props'] | undefined;
  role: Role;

  getRole(roleId: Snowflake) {
    return this.context?.roles.find(r => r.id === roleId) ?? GuildUtils.getGuildRoleWithoutGuildId(roleId);
  }
  removeRole() {
    if (!this.role) return;
    this.context?.onRemoveRole(this.role);
  }
  canRemoveRole() {
    if (!this.role) return false;
    return this.context.guild.ownerId === this.context.currentUser.id 
    || (this.context.canManageRoles && this.context.highestRole.id !== this.role.id);
  }
};