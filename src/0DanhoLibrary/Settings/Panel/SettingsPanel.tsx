import { React, Setting, TabBar } from "@react";
import { FormSection } from "@dium/components";

import { Settings, titles } from "../Settings";

import { SettingProps } from "./_CreateSettingsGroup";
import { StyleSettings, DiscordChangesSettings, DanhoChangesSettings } from "./Categories";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const tabs = Settings.useSelector(({ styleChanges, discordEnhancements, danhoEnhancements }) => [
    ['styleChanges', styleChanges ? 'Style Changes' : null],
    ['discordEnhancements', discordEnhancements ? 'Discord Enhancements' : null],
    ['danhoEnhancements', danhoEnhancements ? 'Danho Enhancements' : null],
  ] as Array<[string, string]>);
  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection title="Danho Library Features">
        <Setting setting="styleChanges" {...settingProps} />
        <Setting setting="discordEnhancements" {...settingProps} />
        <Setting setting="danhoEnhancements" {...settingProps} />
      </FormSection>
      {tabs.some(([_, value]) => value) && (
        <TabBar tabs={tabs}
          styleChanges={<StyleSettings {...settingProps} />}
          discordEnhancements={<DiscordChangesSettings {...settingProps} />}
          danhoEnhancements={<DanhoChangesSettings {...settingProps} />}
        />
      )}
    </div>
  );
}