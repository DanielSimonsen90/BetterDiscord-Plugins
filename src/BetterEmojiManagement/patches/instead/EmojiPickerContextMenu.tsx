import { Patcher } from "@dium/api";
import WaitForEmojiPickerContextMenu from "@danho-lib/ContextMenus/ExpressionPickerItemOptions";
import { renderBanEmojiMenuItem, isBanFeatureEnabled } from "../../features/BanEmojis";

export default function insteadEmojiPickerContextMenu() {
  if (!isBanFeatureEnabled()) return;
  
  WaitForEmojiPickerContextMenu((menu, key) => {
    Patcher.instead(menu, key, data => {
      return renderBanEmojiMenuItem(data);
    });
  });
}