import CreateSettingsGroup from "../../_CreateSettingsGroup";
import { StyleChanges, StyleChangesTitles } from '../../../Settings';
import PrettifyRoles from "./PrettifyRoles";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }) => {
    switch (setting) {
      case 'prettyRoles': return props.settings.prettyRoles ? <PrettifyRoles {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof StyleChanges> = [
    'defaultRoleColor', 'groupRoles'
  ];

  return (<>
    {Object.keys(StyleChanges)
      .filter(key => !ignoredSettings.includes(key as any))
      .map((key, index) => (<>
        <FormSection title={StyleChangesTitles[key]} key={index}>
          <Setting setting={key as any} {...props} />
          <AdditionalSettings setting={key} />
        </FormSection>
        <FormDivider />
      </>))}
  </>);
});