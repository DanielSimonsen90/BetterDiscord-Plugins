import { SortedGuildStore } from '@stores';
import CreateSettingsGroup from './_CreateSettingsGroup';

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  const folderNames = SortedGuildStore.getGuildFolders().map(folder => folder.folderName);
  
  return (
    <FormSection title="Auto Cancel Friend Request Settings">
      <Setting setting="folderNames" type='select' selectValues={folderNames} {...props} />
    </FormSection>
  );
});
