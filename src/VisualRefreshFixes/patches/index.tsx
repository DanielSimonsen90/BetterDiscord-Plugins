import { Settings } from '../settings';
import afterPrivateChannelSidebarList from './after/PrivateChannelSidebarList';

export default function patch() {
	if (Settings.shouldPatchPrivateChannelSidebarList()) afterPrivateChannelSidebarList();
}