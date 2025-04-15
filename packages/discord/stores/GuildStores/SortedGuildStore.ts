import { Snowflake } from "@discord/types";
import { SnapshotStore } from "@dium/modules/flux";
import { Finder } from "@injections";

export interface GuildsTreeNodeBase {
  id: number | string;
  type?: string;
}

export interface GuildsTreeGuild extends GuildsTreeNodeBase {
  type: "guild";
  id: string;
  parentId: number;
  unavailable: boolean;
}

export interface GuildsTreeFolder extends GuildsTreeNodeBase {
  type: "folder";
  id: number;
  color: number;
  name: string;
  children: GuildsTreeGuild[];
  muteConfig: any;
  expanded: boolean;
}

type GuildsTreeNode = GuildsTreeGuild | GuildsTreeFolder;

export interface GuildsTreeRoot {
  type: "root";
  children: GuildsTreeNode[];
}

export interface GuildsTree {
  nodes: Record<string, GuildsTreeNode>;
  root: GuildsTreeRoot;
  version: number;
  get size(): number;

  addNode(node: GuildsTreeNodeBase);
  allNodes(): GuildsTreeNode[];
  convertToFolder(node: GuildsTreeNodeBase);
  getNode(nodeId: number);
  getRoots(): GuildsTreeNode[];
  moveInto(node: GuildsTreeNodeBase, parent: GuildsTreeNodeBase);
  moveNextTo(node: GuildsTreeNodeBase, sibling: GuildsTreeNodeBase);
  removeNode(node: GuildsTreeNodeBase);
  replaceNode(node: GuildsTreeNodeBase, toReplace: GuildsTreeNode);
  sortedGuildNodes(): GuildsTreeGuild[];
  _pluckNode(node: GuildsTreeNodeBase);
}

export interface GuildFolder {
  folderId?: number;
  folderName?: string;
  folderColor?: number;
  guildIds: Snowflake[];
  expanded?: boolean;
}

export interface SortedGuildStore extends SnapshotStore {
  getGuildsTree(): GuildsTree;
  getGuildFolders(): GuildFolder[];
  getFlattenedGuilds(): GuildsTreeGuild[];
  getFlattenedGuildIds(): Snowflake[];
  getCompatibleGuildFolders(): GuildFolder[];
}

export const SortedGuildStore = Finder.byName<SortedGuildStore>("SortedGuildStore");