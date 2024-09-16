import { Filters, Finder, Logger, Patcher } from '@dium/api';

import { Settings } from '../../Settings';

import { Role } from '@discord/types/guild/role';
import { User } from '@discord/types/user';
import { Guild } from '@discord/types/guild';
import { GuildMember } from '@discord/types/guild/member';

import afterRoleContextMenu from '../patches/after/roleContextMenu';
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

  afterRoleContextMenu();
}