import { createDiumStore } from "@stores";
import { createSettings } from "@dium/settings";
import { formatDate } from "./methods";

export type Settings = {
  leftAlign: string;
}
export const Settings = createSettings<Settings>({
  leftAlign: '1ch'
}, function onLoad() {
  // Settings are loaded automatically, but additional SettingsStores are not, so load them here
  Highscores.load();
});

export type Highscores = {
  best: number;
  bestDate: string;
  today: number;
  todayDate: string;
}
export const Highscores = createDiumStore<Highscores>({
  best: 0,
  bestDate: formatDate(new Date()),
  today: 0,
  todayDate: formatDate(new Date())
}, 'highscores');