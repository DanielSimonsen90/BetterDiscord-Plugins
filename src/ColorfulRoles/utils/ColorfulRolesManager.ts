import type { Snowflake, Role } from '@discord/types';
import { RolesListModule } from '@injections/patched/RolesList';
import { GuildUtils } from '@utils';

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