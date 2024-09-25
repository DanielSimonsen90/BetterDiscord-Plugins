import CreateSettingsGroup from "./_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => (
  <FormSection title="Badges Settings">
    <Setting setting="movePremiumBadge" {...props} />
  </FormSection>
))