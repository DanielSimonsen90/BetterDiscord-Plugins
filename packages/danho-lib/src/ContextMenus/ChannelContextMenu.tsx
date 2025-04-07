import { Channel, Guild, Snowflake } from '@discord/types';
import { RenderedMenuItem, RenderedMenuItemChildren } from './Builder.types';
import { Unpatch } from './PatchTypes';

type ChannelContextMenuFiber = {
  props: {
    'aria-label': "Channel Actions";
    children: [
      blank: JSX.BD.Rendered,
      MarkAsReadOrFavorite: JSX.BD.Rendered<{
        children: [
          null | RenderedMenuItem<"mark-channel-read", "Mark as Read">,
          null | RenderedMenuItem<"favorite-channel", "Favorite Channel">,
        ]
      }>,
      ChannelActions: JSX.BD.Rendered<{
        children: [
          InvitePeople: RenderedMenuItem<"invite-people", "Invite People"> & {
            props: {
              color: 'brand';
            }
          },
          InviteToSpotifySession: [
            InviteToListenAlong: RenderedMenuItem<"invite-to-listen", "Invite to Listen Along">,
            SpotifyText: JSX.BD.Rendered
          ],
          OptChannelStructure: [
            FavoirteChannel: RenderedMenuItem<"opt-in-favorite-channel", "Favorite">,
            ModifyFromChannelList: (
              | RenderedMenuItem<"opt-into-channel", "Remove from Channel List">
              | RenderedMenuItem<"opt-into-channel", "Add to Channel List">
            ),
          ],
          CopyLink: RenderedMenuItem<"channel-copy-link", "Copy Link">,
        ]
      }>,
      VoiceActions: JSX.BD.Rendered<{
        children: [
          null,
          OpenChat: RenderedMenuItem<"open-chat", "Open Chat">,
          SetStatus: RenderedMenuItem<"set-status", "Set Status">,
          HideVoiceNames: RenderedMenuItem<"hide-voice-names", "Hide Names"> & {
            props: {
              checked: boolean;
            }
          },
          null,
          null,
        ]
      }>,
      Notifications: JSX.BD.Rendered<{
        children: [
          MuteChannel: RenderedMenuItemChildren<"mute-channel", "Mute Channel", [
            FifteenMinutes: RenderedMenuItem<"900", "For 15 Minutes">,
            OneHour: RenderedMenuItem<"3600", "For 1 Hour">,
            ThreeHours: RenderedMenuItem<"10800", "For 3 Hours">,
            EightHours: RenderedMenuItem<"28800", "For 8 Hours">,
            TwentyFourHours: RenderedMenuItem<"86400", "For 24 Hours">,
            Permanent: RenderedMenuItem<"-1", "Until I turn it back on">,
          ]>
        ]
      }>,
      anotherBlank: JSX.BD.Rendered,
      AdminActions: JSX.BD.Rendered<{
        children: [
          Edit: RenderedMenuItem<"edit-channel", "Edit Channel">,
          Duplicate: RenderedMenuItem<"clone-channel", "Duplicate Channel">,
          CreateVoiceChannel: RenderedMenuItem<"create-voice-channel", "Create Voice Channel">,
          Delete: RenderedMenuItem<"delete-channel", "Delete Channel"> & {
            props: {
              color: 'danger';
            }
          },
        ]
      }>,
      DeveloperActions: JSX.BD.Rendered<{
        children: [
          CopyChannelId: RenderedMenuItem<`devmode-copy-id-${Snowflake}`, "Copy Channel ID"> & {
            props: {
              icon: JSX.BD.FC
            }
          }
        ]
      }>,
    ];
    navId: 'channel-context';
    onClose: (e: React.MouseEvent) => void;
    onSelect: undefined;
  };
};

type ChannelContextMenuTargetProps = {
  channel: Channel;
  config: { context: "APP" },
  context: "APP",
  guild: Guild;
  onHeightUpdate: () => void;
  position: 'right';
  target: HTMLElement;
  theme: string;
};

export type Callback = (menu: ChannelContextMenuFiber, targetProps: ChannelContextMenuTargetProps, unpatch: Unpatch) => void;

export function PatchChannelContextMenu(callback: Callback) {
  const unpatch = BdApi.ContextMenu.patch('channel-context', (tree, props) => {
    return callback(tree, props, unpatch);
  });

  return unpatch;
}

export default PatchChannelContextMenu;