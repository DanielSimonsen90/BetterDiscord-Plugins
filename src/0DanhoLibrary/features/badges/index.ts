import { Settings,Badges } from '../../Settings';
import afterBadgeList from '../patches/after/BadgeList';
import insteadBadgeList from '../patches/instead/BadgeList';

export default function Feature() {
  if (!Settings.current.badges) return;
  Badges.load();

  insteadBadgeList();
  afterBadgeList();
}