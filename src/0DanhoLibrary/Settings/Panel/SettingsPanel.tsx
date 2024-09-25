import { React } from "@dium/modules";
import { FormDivider, FormLabel, FormSection } from "@dium/components";
import { Setting, TabBar } from "@components/index";

import { Settings, titles } from "../Settings";

import { SettingProps } from "./_CreateSettingsGroup";
import PrettyRolesSettings from "./PrettyRolesSettings";
import BadgesSettings from "./BadgesSettings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const tabs = Settings.useSelector(({ prettyRoles, badges }) => [
    ['prettyRoles', prettyRoles ? 'Pretty Roles' : null],
    ['badges', badges ? 'Badges' : null]
  ] as Array<[string, string]>);
  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection title="Danho Library Features">
        <FormLabel>Features</FormLabel>
        <Setting setting="prettyRoles" {...settingProps} />
        <Setting setting="badges" {...settingProps} />
      </FormSection>
      {tabs.some(([_, value]) => value) && (
        <TabBar tabs={tabs}
          prettyRoles={<PrettyRolesSettings {...settingProps} />}
          badges={<BadgesSettings {...settingProps} />}
        />
      )}
    </div>
  );
}