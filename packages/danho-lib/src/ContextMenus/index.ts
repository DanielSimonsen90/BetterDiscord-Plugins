import { MenuCallbacks, MenuType } from './PatchTypes';

export * from './Builder';
export * from './Builder.types';

export { Callback as ChannelContextMenuCallback, PatchChannelContextMenu } from './ChannelContextMenu';
export { Callback as ExpressionPickerContextMenuCallback, PatchExpressionPicker } from './ExpressionPickerItemOptions';
export { Callback as GuildContextMenuCallback, PatchGuildContextMenu } from './GuildContextMenu';
export { Callback as UserContextMenuCallback, PatchUserContextMenu } from './UserContextMenu';

export function createContextMenuCallback<TMenuType extends MenuType>(menuType: TMenuType, callback: MenuCallbacks[TMenuType]) {
  return callback;
}