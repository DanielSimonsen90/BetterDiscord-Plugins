import WaitForEmojiPicker from "@danho-lib/Modals/ExpressionPicker";
import { Patcher } from "@dium/api";
import { addBannedDataTagToEmojiElement, addBannedTagToEmoji, isBanFeatureEnabled } from "../../features/BanEmojis";

export default function afterEmojiPicker() {
  if (!isBanFeatureEnabled()) return;

  return WaitForEmojiPicker((emojiPicker, key) => {
    Patcher.after(emojiPicker, key, data => {
      addBannedTagToEmoji(data);
      addBannedDataTagToEmojiElement(data);
    }, { name: 'EmojiPicker' });
  });
}