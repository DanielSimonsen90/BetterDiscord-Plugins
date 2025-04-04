import { Settings } from "../../../Settings"
import CustomBadgesStore from "./stores/CustomBadgesStore";
import DiscordBadgeStore from "./stores/DiscordBadgeStore";

export { default as style } from './style.scss';

export default function Feature() {
  if (!Settings.current.badges) return;
  if (Settings.current.useClientCustomBadges) CustomBadgesStore.load();
  
  DiscordBadgeStore.load();
 }