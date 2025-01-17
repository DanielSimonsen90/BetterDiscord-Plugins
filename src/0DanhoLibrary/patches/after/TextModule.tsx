import { TextModule } from '@danho-lib/Patcher/Text';
import { Patcher } from '@dium/api';
import transformTextIntoLinks from 'src/0DanhoLibrary/features/style-changes/pronouns-page-links/transformTextIntoLinks';
import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterTextModule() {
  if (!Settings.current.pronounsPageLinks) return;
  
  Patcher.after(TextModule, 'render', (data) => {
    if (Settings.current.pronounsPageLinks) transformTextIntoLinks(data);
  }, { name: 'TextModule--Pronouns' });
}