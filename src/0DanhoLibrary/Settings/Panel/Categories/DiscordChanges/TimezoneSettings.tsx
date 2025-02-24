import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting) => (<>
  <Setting setting="hideTimezoneIcon" {...props} />
  <Setting setting="hideTimezoneTimestamp" {...props} />
</>))