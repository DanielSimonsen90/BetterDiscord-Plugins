import { ContextMenuConfig } from "betterdiscord";
import { MouseEvent } from "@react";

import { RenderedMenuItem, ContextMenuItemProps } from "../ContextMenus/Builder.types";
import * as ContextMenus from "../ContextMenus";

type BaseMenu = {
  props: {
    children?: Array<RenderedMenuItem<any, any> | BaseMenu>;
  };
};

function getGroupContaining(itemId: string, menu: any): Array<RenderedMenuItem<any, any>> | null {
  const findItem = (menu: BaseMenu): Array<RenderedMenuItem<any, any>> | null => {
    if (!menu.props || !menu.props.children) return null;
    else if (!Array.isArray(menu.props.children)) return findItem(menu.props.children as BaseMenu);

    for (const child of menu.props.children.filter(child => child?.props)) {
      if ('id' in child.props && child.props.id === itemId) {
        return menu.props.children as Array<RenderedMenuItem<any, any>>;
      } else if ('key' in child && child.key === itemId) {
        return menu.props.children as Array<RenderedMenuItem<any, any>>;
      }
      
      const found = findItem(child as BaseMenu);
      if (found) return found;
    }

    return null;
  };

  return findItem(menu);
}

function openContextMenu(items: Array<ContextMenuItemProps>, config?: ContextMenuConfig) {
  return (e: MouseEvent) => BdApi.ContextMenu.open(e as any, ContextMenus.buildContextMenu(...items), config);
}

export const ContextMenuUtils = {
  getGroupContaining,
  openContextMenu,
}

export default ContextMenuUtils;