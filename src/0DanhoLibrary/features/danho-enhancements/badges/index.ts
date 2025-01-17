import { Badges, Settings } from "../../../Settings"
import afterBadgeList from "../../../patches/after/BadgeList";

export default function Feature() {
  if (!Settings.current.badges) return;
  Badges.load();

  afterBadgeList();
}