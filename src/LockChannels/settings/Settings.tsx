import { createSettings } from "@dium/settings";

export const Settings = createSettings({
  initialLockState: true,
  unlockedForMinutes: 5,
});
export type Settings = typeof Settings.current;

export const titles: Record<keyof Settings, string> = {
  initialLockState: `Initial lock state for channels`,
  unlockedForMinutes: `Minutes to lock channels for`,
}