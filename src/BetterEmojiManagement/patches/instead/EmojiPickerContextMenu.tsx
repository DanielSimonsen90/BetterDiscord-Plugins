import { Patcher } from "@dium/api";
import WaitForEmojiPickerContextMenu from "@danho-lib/ContextMenus/ExpressionPickerItemOptions";
import { renderBanEmojiMenuItem } from "../../features/BanEmojis";

export default function insteadEmojiPickerContextMenu() {
  WaitForEmojiPickerContextMenu((menu, key) => {
    Patcher.instead(menu, key, data => {
      return renderBanEmojiMenuItem(data);
    });
  });
}