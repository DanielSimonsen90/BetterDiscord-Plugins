import insteadEmojiPicker from "./instead/EmojiPicker";
import insteadEmojiStore_getDisambiguatedEmojiContext from "./instead/EmojiStore_getDisambiguatedEmojiContext";
import insteadEmojiPickerContextMenu from "./instead/EmojiPickerContextMenu";
import insteadGetSearchResultsOrder from "./instead/getSearchResultsOrder";

import afterEmojiPicker from "./after/EmojiPicker";

export default function patch() {
  insteadEmojiPicker();
  insteadEmojiStore_getDisambiguatedEmojiContext();
  insteadEmojiPickerContextMenu();
  insteadGetSearchResultsOrder();

  afterEmojiPicker();
}