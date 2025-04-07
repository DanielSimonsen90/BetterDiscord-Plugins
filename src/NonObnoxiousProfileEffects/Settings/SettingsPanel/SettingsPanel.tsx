import React, { Setting } from "@react";
import { Settings, titles } from "../Settings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const props = {
    settings,
    set,
    titles,
  }

  return (
    <div className="danho-plugin-settings">
      <Setting {...props} setting="opacity" type="text" />
    </div>
  );
};