import { Patcher } from "@dium/api";

type MenuItemFiber = {
  props: {
    action: (() => void) | ((e: any) => void),
    id: string,
    label: string,

    focusedClassName?: undefined,
    icon?: (e: any) => any,
    iconLeft?: undefined,
  };
};


export type ExpressionPickerContextMenuFiber = {
  props: {
    'aria-label': 'Expression Picker Actions',
    children: {
      props: {
        children: [
          UnfavoriteAction: MenuItemFiber,
          DevCopyIdAction?: MenuItemFiber,
        ];
      };
    };
    navId: 'expression-picker',
    onClose: (e: any) => void,
    onSelect: undefined;
  };
}

export type ExpressionPickerContextMenuTargetProps = {
  config: { context: 'APP'; },
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
    ];
  };
  theme: string,
};


type Callback = (menu: ExpressionPickerContextMenuFiber, targetProps: ExpressionPickerContextMenuTargetProps) => void;

export function WaitForEmojiPickerContextMenu(callback: Callback) {
  return BdApi.ContextMenu.patch('expression-picker', callback);
}

export default WaitForEmojiPickerContextMenu;