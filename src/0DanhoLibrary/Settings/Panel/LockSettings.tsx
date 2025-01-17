import CreateSettingsGroup from "./_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (
    <FormSection title="Lock Settings">
      <Setting setting="lockPassword" {...props} />
      <Setting setting="lockUnlockForMinutes" {...props} type="number" />
      <Setting setting="initialLockState" {...props} />
    </FormSection>
  );
});