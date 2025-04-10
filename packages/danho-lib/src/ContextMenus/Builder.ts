import { ContextMenuGroupProps, ContextMenuSetup } from "betterdiscord";
import { ContextMenuItemProps } from "./Builder.types";

/// <reference path="https://github.com/BetterDiscord/BetterDiscord/blob/development/src/betterdiscord/api/contextmenu.js" />

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
export function buildTextItemElement(id: string, label: string, action: () => void, props: Partial<ContextMenuItemProps> = {}): JSX.Element | any {
  return BdApi.ContextMenu.buildItem(buildTextItem(id, label, action, props));
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

export function buildCheckboxItem(id: string, label: React.ReactNode, checked: boolean, action: (checked: boolean) => void, props: Partial<ContextMenuItemProps> = {}): ContextMenuItemProps {
  return {
    type: 'toggle',
    id,
    label,
    checked,
    action: () => action(!checked),
    onClose: props.onClose ?? (() => { }),
    ...props
  };
}
export function buildCheckboxItemElement(id: string, label: React.ReactNode, checked: boolean, action: (checked: boolean) => void, props: Partial<ContextMenuItemProps> = {}): any {
  return BdApi.ContextMenu.buildItem(buildCheckboxItem(id, label, checked, action, props));
}

export function buildGroup(items: Array<ContextMenuItemProps>): ContextMenuGroupProps {
  return { type: 'group', items };
}
export function buildGroupElement(items: Array<ContextMenuItemProps>): JSX.Element {
  return BdApi.ContextMenu.buildMenuChildren(items);
}

export function buildSeparator(): ContextMenuItemProps {
  return { type: 'separator' } as ContextMenuItemProps;
}