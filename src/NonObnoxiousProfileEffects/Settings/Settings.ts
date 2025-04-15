import { createSettings } from "@dium";

export const Settings = createSettings({
  opacity: 0.2
});

export const titles: Record<keyof typeof Settings.current, string> = {
  opacity: "Opacity of the profile effect when hovered",
};
