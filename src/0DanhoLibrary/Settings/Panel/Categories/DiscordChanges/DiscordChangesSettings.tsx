import CreateSettingsGroup from "../../_CreateSettingsGroup";
import AutoCancelFriendRequestSettings from "./AutoCancelFriendRequestSettings";
import { DiscordEnhancements, DiscordEnhancementsTitles } from '../../../Settings';
import TimezoneSettings from "./TimezoneSettings";
import BirthdateSettings from "./BirthdateSettings";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AdditionalSettings = ({ setting }) => {
    switch (setting) {
      case 'autoCancelFriendRequests': return props.settings.autoCancelFriendRequests ? <AutoCancelFriendRequestSettings {...props} /> : null;
      case 'showUserTimezone': return props.settings.showUserTimezone ? <TimezoneSettings {...props} /> : null;
      case 'showUserBirthdate': return props.settings.showUserBirthdate ? <BirthdateSettings {...props} /> : null;
      default: return null;
    }
  };

  const ignoredSettings: Array<keyof typeof DiscordEnhancements> = [
    'folderNames',
    'hideTimezoneIcon', 'hideTimezoneTimestamp',
    'hideBirthdateIcon', 'hideBirthdateTimestamp', 'birthdateTimestampStyle',
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