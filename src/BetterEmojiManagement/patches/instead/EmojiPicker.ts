import WaitForEmojiPicker from "@danho-lib/Modals/ExpressionPicker";
import { Patcher } from "@dium/api";
import { addBannedTagToEmoji, isBanFeatureEnabled } from "../../features/BanEmojis";

export default function insteadEmojiPicker() {
  if (!isBanFeatureEnabled()) return;
  
  return WaitForEmojiPicker((emojiPicker, key) => {
    Patcher.instead(emojiPicker, key, data => {
      return addBannedTagToEmoji(data);
    });
  });
}