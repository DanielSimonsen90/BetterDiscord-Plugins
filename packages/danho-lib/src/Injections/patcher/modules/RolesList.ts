import { Role, User, Guild, GuildMember } from '@discord/types';
import { Filters, Finder } from '@dium/api';

export type RolesListModule = {
  RolesList: (props: RolesListModule['RolesListProps']) => JSX.BD.Rendered<{
    canManageRoles: boolean;
    currentUser: User;
    guild: Guild;
    guildMember: GuildMember;
    highestRole: Role;
    roles: Role[];
    user: User;
    onAddRole: (role: Role) => void;
    onRemoveRole: (role: Role) => void;
  }>;
  RolesListProps?: {
    user: User;
    currentUser: User;
    guild: Guild;
  };
};

export const RolesListModule: RolesListModule = Finder.demangle({
  RolesList: Filters.bySource('onAddRole')
}, null, true);

export default RolesListModule;