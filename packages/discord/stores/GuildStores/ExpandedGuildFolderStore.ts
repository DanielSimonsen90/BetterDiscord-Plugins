import { Store } from "@dium/modules/flux";
import { Finder } from "@injections";

export interface ExpandedGuildFolderStore extends Store {
  getExpandedFolders(): Set<number>;
  getState(): { expandedFolders: number[]; };
  isFolderExpanded(folderId: number): boolean;
  __getLocalVars(): any;
}

export const ExpandedGuildFolderStore = Finder.byName<ExpandedGuildFolderStore>("ExpandedGuildFolderStore");