import { $ } from '@danho-lib/DOM';
import { Settings } from 'src/0DanhoLibrary/Settings';
import { Patcher } from '@dium';
import PrivateChannelSidebarList from '@danho-lib/Patcher/PrivateChannelSidebarList';
import { React } from '@react';

export { default as styles } from './styles.scss';

export default function Feature() {
  const {
    uiReworkFix,
    removePrivateSearchButton, groupPrivateChannelNavOptions
  } = Settings.current;
  
  if (!uiReworkFix) return;

  $('#app-mount').addClass('danho-ui-rework-fix');

  
  if (removePrivateSearchButton || groupPrivateChannelNavOptions) {
    Patcher.after(PrivateChannelSidebarList, 'Z', ({ result }) => {
      Patcher.after(result.type, 'type', ({ result }) => {
        if (groupPrivateChannelNavOptions) {
          const navOptions = result.props.children[1].props.children;
          const dividerIndex = navOptions.findIndex(child => child?.key.includes('divider'));
          const [divider] = navOptions.splice(dividerIndex, 1);

          const replacedChildren = [
            <div className='danho-nav-group'>
              {navOptions as Array<JSX.Element>}
            </div>,
            divider
          ];
          result.props.children[1].props.children = replacedChildren as any;
        }

        if (Settings.current.removePrivateSearchButton) result.props.children.shift();
      }, { silent: true });
    }, { once: true, name: 'PrivateChannelSidebarList' });
  }
}