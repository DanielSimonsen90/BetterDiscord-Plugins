import { React, Setting, TabBar } from "@react";
import { FormSection } from "@dium/components";

import { Settings, titles } from "../Settings";

import { SettingProps } from "./_CreateSettingsGroup";
import { DiscordChangesSettings } from "./Categories";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const tabs = Settings.useSelector(({ discordEnhancements }) => [
    ['discordEnhancements', discordEnhancements ? 'Discord Enhancements' : null],
  ] as Array<[string, string]>);
  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection title="Danho Library Features">
        <Setting setting="discordEnhancements" {...settingProps} />
      </FormSection>
      {tabs.some(([_, value]) => value) && (
        <TabBar tabs={tabs}
          discordEnhancements={<DiscordChangesSettings {...settingProps} />}
        />
      )}
    </div>
  );
}