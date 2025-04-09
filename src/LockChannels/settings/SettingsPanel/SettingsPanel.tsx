import React, { Setting } from "@react";
import { FormSection } from '@dium/components';
import { Settings, titles } from "../Settings";
import LockedChannelsSettings from "./LockedChannelsSettings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const props = {
    settings,
    set,
    titles,
  }
  
  return (
    <div className="danho-plugin-settings">
      <FormSection title="General Settings">
        <Setting setting="unlockedForMinutes" {...props} type="number" />
        <Setting setting="initialLockState" {...props} />
      </FormSection>
      <FormSection title="Locked Channels">
        <LockedChannelsSettings {...props} />
      </FormSection>
    </div>
  );
}