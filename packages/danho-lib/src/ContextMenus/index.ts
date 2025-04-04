import { Callback as ChannelContextMenuCallback } from './ChannelContextMenu';
import { Callback as ExpressionPickerContextMenuCallback } from './ExpressionPickerItemOptions';
import { Callback as GuildContextMenuCallback } from './GuildContextMenu';
import { Callback as UserContextMenuCallback } from './UserContextMenu';

export * from './Builder';
export * from './Builder.types';

export { Callback as ChannelContextMenuCallback, PatchChannelContextMenu } from './ChannelContextMenu';
export { Callback as ExpressionPickerContextMenuCallback, PatchExpressionPicker } from './ExpressionPickerItemOptions';
export { Callback as GuildContextMenuCallback, PatchGuildContextMenu } from './GuildContextMenu';
export { Callback as UserContextMenuCallback, PatchUserContextMenu } from './UserContextMenu';



type MenuType = 'channel' | 'guild' | 'user' | 'expression-picker';
type MenuCallbacks = {
  'channel': ChannelContextMenuCallback;
  'guild': GuildContextMenuCallback;
  'user': UserContextMenuCallback;
  'expression-picker': ExpressionPickerContextMenuCallback;
}

export function createContextMenuCallback<TMenuType extends MenuType>(menuType: TMenuType, callback: MenuCallbacks[TMenuType]) {
  return callback;
}