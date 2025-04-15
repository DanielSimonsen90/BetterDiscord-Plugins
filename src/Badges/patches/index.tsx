import afterBadgeList from "./after/BadgeList";
import patchUserContextmenu from './context-menu/UserContextMenu'

export default function patch() {
	afterBadgeList();
	patchUserContextmenu();
}