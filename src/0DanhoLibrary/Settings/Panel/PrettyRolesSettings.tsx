import CreateSettingsGroup from "./_CreateSettingsGroup";
import { rgbToHex, hexToRgb } from "@danho-lib/Utils/Colors";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => (
  <FormSection title="PrettyRoles Settings">
    <Setting setting="defaultRoleColor" type="color" {...props}
      formatValue={rgbString => "#" + rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
      beforeChange={hex => hexToRgb(hex).join(',')}
    />
    <Setting setting="groupRoles" {...props} />
  </FormSection>
));