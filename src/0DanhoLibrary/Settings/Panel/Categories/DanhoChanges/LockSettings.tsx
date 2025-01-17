import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (<>
    <Setting setting="lockPassword" {...props} />
    <Setting setting="lockUnlockForMinutes" {...props} type="number" />
    <Setting setting="initialLockState" {...props} />
  </>);
});