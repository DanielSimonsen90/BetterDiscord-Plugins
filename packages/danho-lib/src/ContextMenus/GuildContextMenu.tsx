import { JSX } from '@react';
import { Guild } from '@discord/types';
import { RenderedMenuItem, RenderedMenuItemChildren, RenderedMenuItemWithGroup } from './Builder.types';
import { Unpatch } from './PatchTypes';

type FolderMenuFiber = {
  props: {
    'aria-label': "Server Actions";
    children: [
      MarkAsRead: React.JSX.BD.Rendered<{
        children: RenderedMenuItem<"mark-folder-read", "Mark Folder as Read">;
      }>,
      null,
      FolderOptions: React.JSX.BD.Rendered<{
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

type GuildMenuFiber = {
  props: {
    'aria-label': "Server Actions";
    children: [
      MarkAsRead: React.JSX.BD.Rendered<{
        children: RenderedMenuItem<"mark-guild-read", "Mark as Read">;
      }>,
      Invite: React.JSX.BD.Rendered<{
        children: RenderedMenuItem<"invite-people", "Invite People">;
      }>,
      ChannelListOptions: React.JSX.BD.Rendered<{
        children: [
          mute: RenderedMenuItem<"mute-guild", "Mute Server">,
          notifications: RenderedMenuItemChildren<
            "guild-notifications",
            React.JSX.BD.Rendered<{ children: [false, "Notification Settings"]; }>,
            React.JSX.BD.Rendered<{
              children: [
                options: React.JSX.BD.Rendered<{
                  children: [
                    all: RenderedMenuItemWithGroup<"0", "All Messages", "guild-notifications">,
                    mentions: RenderedMenuItemWithGroup<"1", [
                      "Only",
                      mentions: React.JSX.BD.Rendered<{
                        children: '@mentions';
                      }, 'strong'>
                    ], "guild-notifications">,
                    nothing: RenderedMenuItemWithGroup<"2", "Nothing", "guild-notifications">,
                  ];
                }>,
                unknown: React.JSX.BD.Rendered<{ children: false; }>,
                suppress: React.JSX.BD.Rendered<{
                  children: [
                    everyoneAndHere: RenderedMenuItem<"suppress-everyone", [
                      "Suppress",
                      React.JSX.BD.Rendered<{
                        children: ['@everyone'];
                      }, 'strong'>,
                      ' and ',
                      React.JSX.BD.Rendered<{
                        children: ['@here'];
                      }, 'strong'>
                    ]>,
                    roles: RenderedMenuItem<"suppress-roles", "Suppress All Role @mentions">,
                    highlights: RenderedMenuItem<"suppress-highlights", "Suppress Highlights">,
                    muteEvents: RenderedMenuItem<"mute-events", "Mute New Events">,
                  ];
                }>,
                mobile: React.JSX.BD.Rendered<{
                  children: RenderedMenuItem<"mobile-push", "Mobile Push Notifications">;
                }>
              ];
            }>>,
          null,
          null,
          hideMutedChannels: RenderedMenuItem<"hide-muted-channels", "Hide Muted Channels">,
          optIn: RenderedMenuItem<"opt-in", "Show All Channels">,
        ];
      }>
    ];
    navId: 'guild-context';
    onClose: (e: React.MouseEvent) => void;
    onSelect: undefined;
  };
};

type GuildContextMenuFiber = FolderMenuFiber | GuildMenuFiber;

type FolderMenuTargetProps = {
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
type GuildMenuTargetProps = {
  config: { context: 'APP'; },
  context: 'APP',
  guild: Guild,
  onheightUpdate(): void,
  position: null;
  target: HTMLDivElement;
  theme: string,
};

type GuildContextMenuTargetProps = FolderMenuTargetProps | GuildMenuTargetProps;

export type Callback = (menu: GuildContextMenuFiber, targetProps: GuildContextMenuTargetProps, unpatch: Unpatch) => void;

export function PatchGuildContextMenu(callback: Callback) {
  const unpatch = BdApi.ContextMenu.patch('guild-context', (tree, props) => {
    return callback(tree as GuildContextMenuFiber, props, unpatch)
  });
  return unpatch;
}

export default PatchGuildContextMenu;