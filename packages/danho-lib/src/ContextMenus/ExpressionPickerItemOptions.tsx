import { Filters, Finder } from "@dium/api";

type MenuItemFiber = {
  props: {
    action: (() => void) | ((e: any) => void),
    id: string,
    label: string,

    focusedClassName?: undefined,
    icon?: (e: any) => any,
    iconLeft?: undefined,
  }
}

type ExpressionPickerContextMenuFiber = {
  props: {
    'aria-label': 'Expression Picker Actions',
    children: {
      props: {
        children: [
          UnfavoriteAction: MenuItemFiber,
          DevCopyIdAction?: MenuItemFiber,
        ]
      }
    }
    navId: 'expression-picker',
    onClose: (e: any) => void,
    onSelect: undefined
  }
}

export type ExpressionPickerContextMenuOptions = {
  default: (props: {
    config: { context: 'APP' },
    context: 'APP',
    onHeightUpdate(): void,
    position: string,
    target: HTMLButtonElement & {
      attributes: [
        tabIndex: Attr,
        className: Attr,
        dataType: Attr,
        dataName: Attr,
        dataSurrogates: Attr,
      ] | [
        tabIndex: Attr,
        className: Attr,
        dataType: Attr,
        dataId: Attr,
        dataName: Attr,
        dataAnimated?: Attr,
      ]
    }
    theme: string,
  }) => ExpressionPickerContextMenuFiber
}

type Callback = (data: ExpressionPickerContextMenuOptions, key: any) => any;

export function WaitForEmojiPickerContextMenu(callback: Callback) {
  Finder.waitFor(Filters.bySource(...['expression-picker']), { resolve: false }).then(module => {
    const key: keyof ExpressionPickerContextMenuOptions = 'default' in module ? 'default' : Object.keys(module)[0] as any;
    if (!(module[key] instanceof Function)) return;
    else callback(module, key);

    throw new Error(`Unexpected module structure, [key: ${key}, module: ${JSON.stringify(module)}]`);
  });
}

export default WaitForEmojiPickerContextMenu;