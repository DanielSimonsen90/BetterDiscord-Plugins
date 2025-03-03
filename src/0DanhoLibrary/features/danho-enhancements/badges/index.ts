import { Settings } from "../../../Settings"
import CustomBadgesStore from "./stores/CustomBadgesStore";
import DiscordBadgeStore from "./stores/DiscordBadgeStore";

export default function Feature() {
  if (!Settings.current.badges) return;

  DiscordBadgeStore.load();
  CustomBadgesStore.load();
}