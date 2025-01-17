import { TextModule } from '@danho-lib/Patcher/Text';
import { Patcher } from '@dium/api';
import transformTextIntoLinks from 'src/0DanhoLibrary/features/style-changes/pronouns-page-links/transformTextIntoLinks';

export default function afterTextModule() {
  Patcher.after(TextModule, 'render', (data) => {
    transformTextIntoLinks(data);
  }, { name: 'TextModule--Pronouns' });
}