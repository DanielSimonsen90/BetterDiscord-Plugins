export * from './HiddenChannelStore';
export * from './ScrollerStore';

import HiddenChannelStore from './HiddenChannelStore';
import ScrollerStore from './ScrollerStore';

export default function loadStores() {
	HiddenChannelStore.load();
	ScrollerStore.load();
}