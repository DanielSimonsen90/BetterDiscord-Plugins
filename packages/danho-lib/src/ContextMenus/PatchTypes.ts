import { Callback as ChannelContextMenuCallback } from './ChannelContextMenu';
import { Callback as ExpressionPickerContextMenuCallback } from './ExpressionPickerItemOptions';
import { Callback as GuildContextMenuCallback } from './GuildContextMenu';
import { Callback as UserContextMenuCallback } from './UserContextMenu';

export type MenuType = 'channel' | 'guild' | 'user' | 'expression-picker';
export type MenuCallbacks = {
  'channel': ChannelContextMenuCallback;
  'guild': GuildContextMenuCallback;
  'user': UserContextMenuCallback;
  'expression-picker': ExpressionPickerContextMenuCallback;
};

export type Unpatch = ReturnType<typeof BdApi.ContextMenu.patch>;