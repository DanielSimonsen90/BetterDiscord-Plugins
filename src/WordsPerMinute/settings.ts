import { createSettings } from "@dium/settings";

export type Settings = {
  autoResetTime: number;
  leftAlign: string;
}
export const Settings = createSettings<Settings>({
  autoResetTime: 1000,
  leftAlign: '1.5rem'
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
export const Highscores = createSettings<Highscores>({
  best: 0,
  bestDate: new Date().toLocaleDateString(),
  today: 0,
  todayDate: new Date().toLocaleDateString()
});