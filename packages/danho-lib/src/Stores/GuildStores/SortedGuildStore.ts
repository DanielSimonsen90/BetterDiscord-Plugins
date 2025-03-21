import { SortedGuildStore as BaseSortedGuildStore } from '@dium/modules/guild';

export interface ExtendedSortedGuildStore extends BaseSortedGuildStore {
  guildIds: string[];
}

export const SortedGuildStore: ExtendedSortedGuildStore = BaseSortedGuildStore as ExtendedSortedGuildStore;
export default SortedGuildStore;