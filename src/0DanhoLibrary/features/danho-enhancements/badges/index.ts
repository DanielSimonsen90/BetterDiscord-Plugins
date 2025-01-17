import { Badges, Settings } from "../../../Settings"

export default function Feature() {
  if (!Settings.current.badges) return;

  Badges.load();
}