import { ContextMenuItemProps } from "./Builder.types";

export function buildContextMenu(...items: Array<ContextMenuItemProps>) {
  return BdApi.ContextMenu.buildMenu(items);
}

export function buildTextItem(id: string, label: string, action: () => void, props: Partial<ContextMenuItemProps> = {}): ContextMenuItemProps {
  return {
    type: 'text',
    label,
    action,
    id,
    onClose: props.onClose ?? (() => { }),
    ...props
  };
}
export function buildSubMenu(id: string, label: string, items: Array<Partial<ContextMenuItemProps>>, props: Partial<ContextMenuItemProps> = {}): ContextMenuItemProps {
  return {
    type: 'submenu',
    label,
    items,
    id,
    action: () => {},
    onClose: props.onClose ?? (() => { }),
    ...props
  };
}
export function buildSubMenuElement(id: string, label: string, items: Array<Partial<ContextMenuItemProps>>, props: Partial<ContextMenuItemProps> = {}): JSX.Element {
  return BdApi.ContextMenu.buildItem(buildSubMenu(id, label, items, props));
}

export function buildTextItemElement(id: string, label: string, action: () => void, props: Partial<ContextMenuItemProps> = {}): JSX.Element {
  return BdApi.ContextMenu.buildItem(buildTextItem(id, label, action, props));
}