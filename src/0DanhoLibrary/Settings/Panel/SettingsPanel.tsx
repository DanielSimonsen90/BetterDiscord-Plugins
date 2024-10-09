import { React, Setting, TabBar } from "@react";
import { FormSection } from "@dium/components";

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
        <Setting setting="prettyRoles" {...settingProps} />
        <Setting setting="badges" {...settingProps} />
        <Setting setting="pronounsPageLinks" {...settingProps} />
        <Setting setting="allowForumSortByAuthor" {...settingProps} />
        <Setting setting="expandBioAgain" {...settingProps} />
        <Setting setting="wakeUp" {...settingProps} />
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