import CreateSettingsGroup from "../../_CreateSettingsGroup";
import { DiscordEnhancements, DiscordEnhancementsTitles } from '../../../Settings';

import TimezoneSettings from "./TimezoneSettings";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }) => {
    switch (setting) {
      case 'showUserTimezone': return props.settings.showUserTimezone ? <TimezoneSettings {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof DiscordEnhancements> = [
    'hideTimezoneIcon', 'hideTimezoneTimestamp',
  ];

  return (<>
    {Object.keys(DiscordEnhancements)
      .filter(key => !ignoredSettings.includes(key as any))
      .map((key, index) => (<>
      <FormSection title={DiscordEnhancementsTitles[key]} key={index}>
        <Setting setting={key as any} {...props} />
        <AdditionalSettings setting={key} />
      </FormSection>
      <FormDivider />
    </>))}
  </>);
});