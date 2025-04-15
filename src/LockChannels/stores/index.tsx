export * from './LockedChannelsStore';

import LockedChannelsStore from './LockedChannelsStore';

export default function loadStores() {
  LockedChannelsStore.load();
}