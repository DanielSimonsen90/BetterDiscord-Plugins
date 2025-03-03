import { RenderedMenuItem } from "@danho-lib/ContextMenus/Builder.types";
import { Logger } from "@danho-lib/dium/api/logger";

type BaseMenu = {
  props: {
    children?: Array<RenderedMenuItem<any, any> | BaseMenu>;
  };
};

export function getGroupContaining(itemId: string, menu: any): Array<RenderedMenuItem<any, any>> | null {
  const findItem = (menu: BaseMenu): Array<RenderedMenuItem<any, any>> | null => {
    if (!menu.props || !menu.props.children) return null;
    else if (!Array.isArray(menu.props.children)) return findItem(menu.props.children as BaseMenu);

    for (const child of menu.props.children.filter(Boolean)) {
      if ('id' in child.props && child.props.id === itemId) {
        return menu.props.children as Array<RenderedMenuItem<any, any>>;
      }
      
      const found = findItem(child as BaseMenu);
      if (found) return found;
    }

    return null;
  };

  return findItem(menu);
}