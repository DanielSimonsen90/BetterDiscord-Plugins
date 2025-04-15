import PatchExpressionPicker from "@context-menus/ExpressionPickerItemOptions";
import { renderBanEmojiMenuItem, isBanFeatureEnabled } from "../../features/BanEmojis";

export default function insteadEmojiPickerContextMenu() {
  if (!isBanFeatureEnabled()) return;

  return PatchExpressionPicker((menu, targetProps) => {
    renderBanEmojiMenuItem(menu, targetProps);
  });
}