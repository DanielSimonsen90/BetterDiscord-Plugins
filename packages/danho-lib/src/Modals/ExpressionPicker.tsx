import { Filters, Finder } from "@dium/api";
import { CustomEmoji } from "@danho-lib/Stores";
import { BetterOmit } from "danholibraryjs";

export type ExpressionPickerMenu = {
  [key: string]: (props: {
    allowAnimatedEmoji: boolean,
    category: string,
    channelGuildId: string,
    emojiDescriptors: Array<{
      type: number,
      emoji: CustomEmoji;
      isDisabled: boolean,
      rowIndex: number,
      size: number,
      subCateogry: string,
      visibleRowIndex: number,
    }>;
    emojiSize: number,
    getEmojiItemProps: (e: any, n: any) => any,
    getEmojiRowProps: (e: any) => any,
    handleScrollUpOnSelectionCollapse: () => void,
    inNitroLockedSection: boolean,
    isBurstreaction: boolean,
    isScrolling: { current: boolean; },
    isUsingKeuboardNavigation: { current: boolean; },
    messageId: string | undefined,
    onInspect: (e: any) => void,
    onSelect: (e: any, t: any) => void,
    rowIndex: number,
    selectedItemClassName: undefined,
    showEmojiFavoriteToolTip: boolean,
    surrogateCodePoint: string,
  }) => ExpressionPickerMenuFiber;
};

type ExpressionPickerMenuFiber = {
  props: {
    'aria-rowindex': number,
    children: Array<{
      props: BetterOmit<Parameters<ExpressionPickerMenu[string]>['0'],
        | 'emojiDescriptors'
      > & {
        descriptor: Parameters<ExpressionPickerMenu[string]>['0']['emojiDescriptors'][0],
        emojiItemKey: string,
        pulseItemKey: null;
      };
    }>,
    className: string,
    role: 'row';
  };
};

type Callback = (data: ExpressionPickerMenu, key: keyof ExpressionPickerMenu) => any;
export async function WaitForEmojiPicker(callback: Callback) {
  return Finder.waitFor(Filters.bySource(...['showEmojiFavoriteTooltip']), { resolve: false }).then(module => {
    const key = 'default' in module ? 'default' : Object.keys(module)[0];
    return callback(module, key);
  });
}

export default WaitForEmojiPicker;