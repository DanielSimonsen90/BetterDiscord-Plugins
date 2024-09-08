import insteadEmojiPicker from "./instead/EmojiPicker";
import insteadEmojiStore_getDisambiguatedEmojiContext from "./instead/EmojiStore_getDisambiguatedEmojiContext";
import insteadGetSearchResultsOrder from "./instead/getSearchResultsOrder";

import afterEmojiPicker from "./after/EmojiPicker";

export default function patch() {
  insteadEmojiPicker();
  insteadEmojiStore_getDisambiguatedEmojiContext();
  // insteadEmojiPickerContextMenu(); // ContextMenu needs to be loaded before patching its context menu
  insteadGetSearchResultsOrder();

  afterEmojiPicker();
}