import { QuickSwitcherStore } from '@danho-lib/Stores';
import { Patcher } from '@dium/api';
import redefineQuickSwitcherProps from 'src/0DanhoLibrary/features/discord-enhancements/better-quickswitcher/redefineQuickswitcherProps';
import { Settings } from 'src/0DanhoLibrary/Settings';

export default function afterQuickSwitcherStore_getProps() {
  if (!Settings.current.betterQuickSwitcher) return;
  
  Patcher.after(QuickSwitcherStore, 'getProps', (data) => {
    if (Settings.current.betterQuickSwitcher) redefineQuickSwitcherProps(data);
  }, { name: 'QuickSwitcherStore.getProps()' });
}