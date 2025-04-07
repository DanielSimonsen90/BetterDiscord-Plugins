import CreateSettingsGroup from "../../_CreateSettingsGroup";
import BadgesSettings from "./BadgesSettings";
import LockSettings from "./LockSettings";
import HidingSettings from "./HidingSettings";
import { DanhoEnhancements, DanhoEnhancementsTitles } from '../../../Settings';

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }) => {
    switch (setting) {
      case 'badges': return props.settings.badges ? <BadgesSettings {...props} /> : null;
      case 'lockChannels': return props.settings.lockChannels ? <LockSettings {...props} /> : null;
      case 'wakeUp': return props.settings.wakeUp ? <HidingSettings {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof DanhoEnhancements> = [
    'useClientCustomBadges', 
    'lockPassword', 'lockUnlockForMinutes', 'initialLockState',
    'isHidingOnPurpose'
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