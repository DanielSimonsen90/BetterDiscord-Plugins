import { Patcher } from "@dium";

import { buildRadioItemElement } from "@danho-lib/ContextMenus";
import { Logger } from "@danho-lib/dium/api/logger";
import { $ } from "@danho-lib/DOM";
import SortAndViewMenuModule from "@danho-lib/Patcher/SortAndViewMenu";
import { wait, ClassNamesUtils } from "@danho-lib/Utils";

import orderPostsByAuthor from "../../utils/orderPostsByAuthor";

export default async function afterSortAndView() {
  let currentSelectedItemId: string | null = null;
  const classModule = ClassNamesUtils.combineModuleByKeys<(
    'refreshIcon' | 'radioIndicatorChecked'
  )>(
    ["radioIndicatorDisabled"]
  )

  const SortAndViewMenu = await SortAndViewMenuModule;
  Patcher.after(SortAndViewMenu, 'Z', ({ result, args: [props] }) => {
    const menuItemsParent = result.props.children.props.children[0]
    const menuItems = menuItemsParent.props.children;
    if (!menuItems) return Logger.error('Sort and view menu not found');

    const isSortedByAuthor = !!$(`.danho-sort-by-author`);

    menuItemsParent.props.children = menuItems.map((item, index) => ({
      ...item,
      props: {
        ...item.props,
        checked: isSortedByAuthor ? false : item.props.checked,
        action: async () => {
          $(`.danho-sort-by-author`)?.removeClass('danho-sort-by-author');
          if (currentSelectedItemId?.includes(item.props.id)) menuItems.find((_, i) => i !== index)?.props.action?.();
          await wait(100);
          item.props.action?.();
        }
      }
    })) as any

    menuItemsParent.props.children.push(buildRadioItemElement(
      'sort-by-author',
      'Author',
      isSortedByAuthor,
      async () => {
        orderPostsByAuthor();

        const selectedCircle = $(`.${classModule.refreshIcon}`)
        const currentSelectedSvg = $(`.${classModule.radioIndicatorChecked}`);
        currentSelectedSvg.removeClass(classModule.radioIndicatorChecked);

        currentSelectedItemId = currentSelectedSvg.ancestor(s => s.role('menuitemradio')).element.id;

        const sortByAuthorSvg = $(`#sort-and-view-sort-by-author svg`);
        sortByAuthorSvg.addClass(classModule.radioIndicatorChecked);
        sortByAuthorSvg.appendElements([selectedCircle]);

        props.closePopout(undefined);
      }
    ));
  }, { name: 'SortAndViewMenu' });
}