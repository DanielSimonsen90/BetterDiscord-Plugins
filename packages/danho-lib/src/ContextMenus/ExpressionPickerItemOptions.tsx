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

type ExpressionPickerContextMenuOptions = {
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

type Callback = (data: ExpressionPickerContextMenuOptions) => any;

export function WaitForEmojiPickerContextMenu(callback: Callback) {
  Finder.waitFor(Filters.bySource(...['expression-picker']), { resolve: false }).then(callback);
}

export default WaitForEmojiPickerContextMenu;