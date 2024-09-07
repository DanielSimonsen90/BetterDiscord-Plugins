import insteadEmojiPicker from "./instead/EmojiPicker";
import insteadEmojiPickerContextMenu from "./instead/EmojiPickerContextMenu";
import insteadGetSearchResultsOrder from "./instead/getSearchResultsOrder";

import afterEmojiPicker from "./after/EmojiPicker";

export default function patch() {
  insteadEmojiPicker();
  insteadEmojiPickerContextMenu();
  insteadGetSearchResultsOrder();

  afterEmojiPicker();
}