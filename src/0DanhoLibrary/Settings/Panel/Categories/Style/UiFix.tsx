import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting) => (<>
  <Setting setting="removePrivateSearchButton" {...props} />
  <Setting setting="groupPrivateChannelNavOptions" {...props} />
</>));