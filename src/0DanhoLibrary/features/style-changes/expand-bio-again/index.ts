import { $ } from '@danho-lib/DOM';
import { Settings } from 'src/0DanhoLibrary/Settings';
export { default as styles } from './style.scss';

export default function Feature() {
  if (!Settings.current.expandBioAgain) return;

  $('#app-mount').addClass('danho-expand-bio-again');
}