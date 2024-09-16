import { Setting } from "@danho-lib/React";

import { FormLabel, FormSection } from "@dium/components";
import { React } from "@dium/modules";  

import { Settings, titles } from "./Settings";

export default function SettingsPanel() {
  const [settings, set] = Settings.useState();
  const settingProps = { settings, set, titles };

  return (
    <div className="danho-plugin-settings">
      <FormSection>
        <FormLabel>Features</FormLabel>
        <Setting setting="prettyRoles" {...settingProps} />
      </FormSection>
    </div>
  );
}