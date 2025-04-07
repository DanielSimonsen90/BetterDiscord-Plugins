import afterRolesList from "./after/RolesList";
import patchRoleContextMenu from './context-menus/RoleContextMenu';

export default function patch() {
	afterRolesList();
	patchRoleContextMenu();
}