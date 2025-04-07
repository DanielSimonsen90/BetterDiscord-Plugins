import CreateSettingsGroup from "../../_CreateSettingsGroup";
import LockSettings from "./LockSettings";
import { DanhoEnhancements, DanhoEnhancementsTitles } from '../../../Settings';

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }) => {
    switch (setting) {
      case 'lockChannels': return props.settings.lockChannels ? <LockSettings {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof DanhoEnhancements> = [
    'lockPassword', 'lockUnlockForMinutes', 'initialLockState',
  ];

  return (<>
    {Object.keys(DanhoEnhancements)
      .filter(key => !ignoredSettings.includes(key as any))
      .map((key, index) => (<>
      <FormSection title={DanhoEnhancementsTitles[key]} key={index}>
        <Setting setting={key as any} {...props} />
        <AdditionalSettings setting={key} />
      </FormSection>
      <FormDivider />
    </>))}
  </>);
});