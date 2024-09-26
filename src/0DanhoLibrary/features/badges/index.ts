import { Settings,Badges } from '../../Settings/Settings';
import afterBadgeList from '../../patches/after/BadgeList';

export default function Feature() {
  if (!Settings.current.badges) return;
  Badges.load();

  afterBadgeList();
}