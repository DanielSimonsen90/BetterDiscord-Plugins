export * from './BirthdayStore';

import BirthdayStore from './BirthdayStore';

export default function loadStores() {
	BirthdayStore.load();
}