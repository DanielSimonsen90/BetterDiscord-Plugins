import { Setting } from "@danho-lib/React";

import { FormLabel, FormSection, FormDivider } from "@dium/components";
import { React } from "@dium/modules";  

import { Settings, titles } from "./Settings";
import { Setter } from "@dium/settings";
import { hexToRgb, rgbToHex } from "@danho-lib/Utils/Colors";

type SettingProps = {
  settings: typeof Settings.current,
  set: Setter<typeof Settings.current>,
  titles: typeof titles,
}

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const features = Settings.useSelector(({ prettyRoles, memberListTabBar }) => ({ prettyRoles, memberListTabBar }));

  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection>
        <FormLabel>Features</FormLabel>
        <Setting setting="prettyRoles" {...settingProps} />
        <Setting setting="memberListTabBar" {...settingProps} />
      </FormSection>
      {features.prettyRoles && <PrettyRolesSettings {...settingProps} />}
      {features.memberListTabBar && <MemberListTabbar {...settingProps} />}
    </div>
  );
}

function PrettyRolesSettings(props: SettingProps) {
  return (<>
    <FormDivider />
    <FormSection>
      <FormLabel>Pretty Roles</FormLabel>
      <Setting setting="defaultRoleColor" type="color" {...props}
        formatValue={rgbString => "#" + rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
        beforeChange={hex => hexToRgb(hex).join(',')}
      />
      <Setting setting="groupRoles" {...props} />
    </FormSection>
  </>)
}

function MemberListTabbar(props: SettingProps) {
  return (<>
    <FormDivider />
    <FormSection>
      <FormLabel>Member List Tab Bar</FormLabel>
      <Setting setting="countMembers" {...props} />
      <Setting setting="countActivities" {...props} />
    </FormSection>
  </>)
}