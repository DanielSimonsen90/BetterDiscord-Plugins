import WaitForEmojiPicker from "@danho-lib/Modals/ExpressionPicker";
import { Patcher } from "@dium/api";
import { addBannedDataTagToEmojiElement } from "../../features/BanEmojis";

export default function afterEmojiPicker() {
  WaitForEmojiPicker((emojiPicker, key) => {
    Patcher.after(emojiPicker, key, data => {
      addBannedDataTagToEmojiElement(data);
    });
  });
}