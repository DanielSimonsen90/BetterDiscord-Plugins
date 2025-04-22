import { SlashCommandUtils } from "@utils";
import BirthdayStore from "../stores/BirthdayStore";

export default SlashCommandUtils.createSlashCommand({
  name: 'load-from-friends',
  description: `Load birthday data from friend notes`,
  execute: async () => {
    BdApi.UI.showToast('Loading birthday data from friend notes...');
    BirthdayStore.loadFriendNotes()
    .then(() => BdApi.UI.showToast('All birthdays loaded.'))
    .catch(() => BdApi.UI.showToast('Failed to load birthday data from friend notes.', { type: 'error' }));
  }
})