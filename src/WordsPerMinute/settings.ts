import { createDiumStore } from "@danho-lib/Stores";
import { createSettings } from "@dium/settings";

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
  bestDate: new Date().toLocaleDateString(),
  today: 0,
  todayDate: new Date().toLocaleDateString()
}, 'highscores');