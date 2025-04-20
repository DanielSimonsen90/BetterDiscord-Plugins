export * from './TemplateStore';

import { Settings } from '../settings/Settings';
import TemplateStore from './TemplateStore';

export default function loadStores() {
	if (!Settings.current) return;
	
	TemplateStore.load();
}