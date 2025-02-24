import { Settings } from 'src/0DanhoLibrary/Settings';
import BirthdayStore from './BirthdayStore';
import { Logger } from '@dium';

export { default as style } from './style.scss';

export default function Feature() {
  if (!Settings.current.showBirthdayOnNameTag) return null;

  BirthdayStore.load();
  Logger.log('[BirthdayStore] Loaded birthday data', BirthdayStore.current);
}