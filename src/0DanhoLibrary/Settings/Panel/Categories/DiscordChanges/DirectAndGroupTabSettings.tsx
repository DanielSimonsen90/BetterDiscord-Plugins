import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting) => (<>
  <Setting setting="defaultDirectAndGroupTab" {...props} type="select" options={['direct', 'group']} />
</>))