import WaitForEmojiPicker from "@danho-lib/Modals/ExpressionPicker";
import { Patcher } from "@dium/api";
import { addBannedDataTagToEmojiElement, isBanFeatureEnabled } from "../../features/BanEmojis";
import insteadEmojiPickerContextMenu from "../instead/EmojiPickerContextMenu";

export default function afterEmojiPicker() {
  if (!isBanFeatureEnabled()) return;

  return WaitForEmojiPicker((emojiPicker, key) => {
    const cancel = Patcher.after(emojiPicker, key, data => {
      addBannedDataTagToEmojiElement(data);
    });
    
    return [cancel, insteadEmojiPickerContextMenu()];
  });
}