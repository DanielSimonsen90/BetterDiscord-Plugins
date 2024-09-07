import WaitForEmojiPicker from "@danho-lib/Modals/ExpressionPicker";
import { Patcher } from "@dium/api";
import { addBannedTagToEmoji } from "../../features/BanEmojis";

export default function insteadEmojiPicker() {
  WaitForEmojiPicker((emojiPicker, key) => {
    Patcher.instead(emojiPicker, key, data => {
      return addBannedTagToEmoji(data);
    });
  });
}