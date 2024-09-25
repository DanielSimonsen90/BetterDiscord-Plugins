import { Filters, Finder } from '@dium/api';

import { RolesListModule } from './types';
import afterRoleContextMenu from '../patches/after/roleContextMenu';
import insteadRolesList from '../patches/instead/RolesList';
import afterRolesList from '../patches/after/RolesList';
import { Settings } from '../../Settings/Settings';

export { default as styles } from './pretty-roles.scss';

export const isPrettyRolesEnabled = () => Settings.current.prettyRoles;
export default function Feature() {
  if (!isPrettyRolesEnabled()) return;

  const RolesListModule: RolesListModule = Finder.demangle({
    RolesList: Filters.bySource('onAddRole')
  }, null, true);

  insteadRolesList(RolesListModule);
  afterRolesList(RolesListModule);
  afterRoleContextMenu();
}