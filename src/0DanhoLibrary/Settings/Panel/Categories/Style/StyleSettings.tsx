import CreateSettingsGroup from "../../_CreateSettingsGroup";
import { StyleChanges, StyleChangesTitles } from '../../../Settings';

import UiFix from './UiFix';

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }: { setting: keyof typeof StyleChanges }) => {
    switch (setting) {
      case 'uiReworkFix': return props.settings.uiReworkFix ? <UiFix {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof StyleChanges> = [
    'removePrivateSearchButton', 'groupPrivateChannelNavOptions',
  ];

  return (<>
    {Object.keys(StyleChanges)
      .filter(key => !ignoredSettings.includes(key as any))
      .map((key, index) => (<>
        <FormSection title={StyleChangesTitles[key]} key={index}>
          <Setting setting={key as any} {...props} />
          <AdditionalSettings setting={key as any} />
        </FormSection>
        <FormDivider />
      </>))}
  </>);
});