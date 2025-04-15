import afterChannelItem from "./after/ChannelItem";
import patchChannelContextMenu from "./context-menus/ChannelContextMenu";

export default function patch() {
	afterChannelItem();
	patchChannelContextMenu();
}