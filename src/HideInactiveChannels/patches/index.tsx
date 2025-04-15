import afterGuildChannelList from "./after/GuildChannelList";
import patchChannelContextMenu from "./context-menus/ChannelContextMenu";
import patchGuildContextMenu from "./context-menus/GuildContextMenu";

export default function patch() {
	afterGuildChannelList();
	
	patchChannelContextMenu();
	patchGuildContextMenu();
}