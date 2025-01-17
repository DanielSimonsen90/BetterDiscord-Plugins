import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (
    <Setting setting="useClientCustomBadges" {...props} />
  );

  // TODO: Add ability to add custom badges to the settings panel
});