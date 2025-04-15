export * from './BadgePositionsStore';
export * from './CustomBadgesStore';
export * from './DiscordBadgeStore';

import { Settings } from '../settings/Settings';
import BadgePositionsStore from './BadgePositionsStore';
import CustomBadgesStore from './CustomBadgesStore';
import DiscordBadgeStore from './DiscordBadgeStore';

export default function loadStores() {
  if (!Settings.current.useClientCustomBadges) return;

  BadgePositionsStore.load();
  CustomBadgesStore.load();
  DiscordBadgeStore.load();
}