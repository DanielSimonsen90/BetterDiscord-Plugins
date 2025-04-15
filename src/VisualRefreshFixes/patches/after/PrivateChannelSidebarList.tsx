import React from '@react';
import { Patcher } from "@dium";

import PrivateChannelSidebarList from '@injections/patched/PrivateChannelSidebarList';
import { Settings } from '../../settings';

export default function afterPrivateChannelSidebarList() {
  const { groupPrivateChannelNavOptions } = Settings.current;

  Patcher.after(PrivateChannelSidebarList, 'Z', ({ result }) => {
    Patcher.after(result.type, 'type', ({ result }) => {
      if (groupPrivateChannelNavOptions) {
        const navOptions = result.props.children[1].props.children;
        const dividerIndex = navOptions.findIndex(child => child?.key.includes('divider'));
        const [divider] = navOptions.splice(dividerIndex, 1);

        const replacedChildren = [
          <div className='danho-nav-group' >
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