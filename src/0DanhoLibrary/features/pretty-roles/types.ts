import { Role } from '@discord/types/guild/role';
import { User } from '@discord/types/user';
import { Guild } from '@discord/types/guild';
import { GuildMember } from '@discord/types/guild/member';

export type Fiber<Props> = { props: Props; };
export type RolesListModule = {
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
    }>;
  }>;
  RolesListProps?: {
    user: User;
    currentUser: User;
    guild: Guild;
  };
};