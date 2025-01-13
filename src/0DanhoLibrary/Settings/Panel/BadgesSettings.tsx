import CreateSettingsGroup from "./_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (
    <FormSection title="Badges Settings">
      <Setting setting="movePremiumBadge" {...props} />
      <Setting setting="useClientCustomBadges" {...props} />
    </FormSection>
  );

  // TODO: Add ability to add custom badges to the settings panel
});