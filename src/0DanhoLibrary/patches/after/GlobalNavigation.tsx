import GlobalNavigation from '@discord/components/GlobalNavigation';
import { Patcher } from '@dium';
import addToGlobalNav from 'src/0DanhoLibrary/features/discord-enhancements/user-birthday/patches/addToGlobalNav';

import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterGlobalNavigation() {
  if (!Settings.current.showBirthdayCalendar) return;

  Patcher.after(GlobalNavigation, 'Z', (data) => {
    if (Settings.current.showBirthdayCalendar) addToGlobalNav(data);
  }, { name: 'GlobalNavigation' });
}