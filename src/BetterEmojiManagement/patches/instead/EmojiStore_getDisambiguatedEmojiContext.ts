import { EmojiStore } from "@danho-lib/Stores";
import { Patcher } from "@dium/api";
import { isBanFeatureEnabled, replaceEmojiStore_getDisambiguatedEmojiContext } from '../../features/BanEmojis';

export default function insteadEmojiStore_getDisambiguatedEmojiContext() {
  if (!isBanFeatureEnabled()) return;

  Patcher.instead(EmojiStore, 'getDisambiguatedEmojiContext', (data) => {
    return replaceEmojiStore_getDisambiguatedEmojiContext(data);
  });
}