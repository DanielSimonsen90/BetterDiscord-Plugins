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
  const prettyRolesEnabled = React.useMemo(() => settings.prettyRoles, [settings.prettyRoles]);

  const settingProps: SettingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection>
        <FormLabel>Features</FormLabel>
        <Setting setting="prettyRoles" {...settingProps} />
      </FormSection>
      {prettyRolesEnabled && <PrettyRolesSettings {...settingProps} />}
    </div>
  );
}

function PrettyRolesSettings(props: SettingProps) {
  return (<>
    <FormDivider />
    <FormSection>
      <FormLabel>Default Role Color</FormLabel>
      <Setting setting="defaultRoleColor" type="color" {...props}
        // formatValue={rgbString => color('hex', { rgb: rgbString.split(',').map(Number) as ColorReturns<'rgb'> })}
        // beforeChange={hex => color('rgb', { hex }).reduce((acc, c, i) => acc + `${i ? `, ${c}` : ''}`, '')}
        formatValue={rgbString => "#" + rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
        beforeChange={hex => hexToRgb(hex).join(',')}
      />
    </FormSection>
  </>)
}