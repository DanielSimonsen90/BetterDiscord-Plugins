import { Callback } from '@danho-lib/ContextMenus/ChannelContextMenu';
import { buildTextItemElement } from "@danho-lib/ContextMenus/Builder";

import joinWithCamera from './joinWithCamera';

const patched: Callback = function (menu, props) {
  const options = menu.props.children;
  const voiceOptions = options[3].props.children;

  voiceOptions.unshift(
    buildTextItemElement(
      "join-with-camera",
      "Join with Camera",
      () => joinWithCamera(props.channel.id)
    ) as any
  );
};

export default patched;