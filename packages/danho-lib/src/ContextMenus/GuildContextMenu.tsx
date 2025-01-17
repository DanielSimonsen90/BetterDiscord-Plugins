import { RenderedMenuItem } from './Builder.types';

type GuildContextMenuFiber = {
  props: {
    'aria-label': "Server Actions";
    children: [
      MarkAsRead: JSX.BD.Rendered<{
        children: RenderedMenuItem<"mark-folder-read", "Mark Folder as Read">;
      }>,
      null,
      FolderOptions: JSX.BD.Rendered<{
        children: [
          folderSettings: RenderedMenuItem<"folder-settings", "Folder Settings">,
          closeAllFolders: RenderedMenuItem<"folder-collapse", "Close All Folders">,
        ];
      }>
    ];
    navId: 'guild-context';
    onClose: (e: React.MouseEvent) => void;
    onSelect: undefined;
  };
};

type GuildContextMenuTargetProps = {
  config: { context: 'APP', onClose: () => void; },
  context: 'APP',
  folderColor: number,
  folderId: number,
  folderName: string,
  onHeightUpdate(): void,
  position: string | 'right',
  target: HTMLDivElement & {},
  theme: string,
  unread: boolean;
};

export type Callback = (menu: GuildContextMenuFiber, targetProps?: GuildContextMenuTargetProps) => void;

export function PatchGuildContextMenu(callback: Callback) {
  return BdApi.ContextMenu.patch('guild-context', callback);
}

export default PatchGuildContextMenu;