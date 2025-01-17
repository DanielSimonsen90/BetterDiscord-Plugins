import { Callback } from '@danho-lib/ContextMenus/GuildContextMenu';
import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";

import { Settings } from 'src/0DanhoLibrary/Settings';

const patched: Callback = function (menu, props) {
  if (!props.folderName) return;
  const isInBlockedFolder = Settings.current.folderNames.includes(props.folderName);

  menu.props.children.push(
    buildTextItemElement('danho-block-friend-requests', isInBlockedFolder ? 'Unblock friend requests' : 'Block friend requests', () => {
      Settings.update(cur => ({
        ...cur, folderNames: isInBlockedFolder
          ? cur.folderNames.filter(v => v !== props.folderName)
          : [...cur.folderNames, props.folderName]
      }));
    }, { color: 'danger' }) as any
  );
};

export default patched;