import { User } from "@discord/types/user";
import { RenderedMenuItem, RenderedMenuItemChildren } from "./Builder.types";
import { Snowflake } from "@discord/types";

type UserContextMenuFiber = {
  props: {
    "aria-label": "User Settings Actions",
    children: [
      main: JSX.BD.Rendered<{
        children: [
          unknnown: JSX.BD.Rendered<{ children: null; }>,
          userActions: JSX.BD.Rendered<{
            children: [
              RenderedMenuItem<"user-profile", "Profile">,
              RenderedMenuItem<"message-user", "Message"> | RenderedMenuItem<"mention", "Mention">,
              RenderedMenuItem<"call", "Call"> | RenderedMenuItem<"message-user", "Message">,
              RenderedMenuItem<"note", "Edit Note">  | RenderedMenuItem<"call", "Call">,
              RenderedMenuItem<"add-friend-nickname", "Add Friend Nickname"> | RenderedMenuItem<"note", "Edit Note">,
              RenderedMenuItem<"add-friend-nickname", "Add Friend Nickname">,
              null
            ];
          }>,
          listenAlong: false | [
            listen: RenderedMenuItem<"invite-to-listen", "Invite to Listen Along">,
            unknown: JSX.BD.Rendered<{}>
          ],
          guildActions: JSX.BD.Rendered<{ children: []; }> | JSX.BD.Rendered<{ children: [
            disableSelf: JSX.BD.Rendered<{ children: [
              RenderedMenuItem<"self-mute", "Mute">,
              RenderedMenuItem<"soundboard-sound-mute", "Mute Soundboard">,
              RenderedMenuItem<"disable-video", "Disable Video">,
            ] }>,
            unknown: null,
            unknown: null,
            changeNickname: RenderedMenuItem<"change-nickname", "Change Nickname">,
            apps: RenderedMenuItemChildren<"apps", "Apps", any>,
          ]; }>,
          userDangerzone: JSX.BD.Rendered<{
            children: [
              false,
              RenderedMenuItemChildren<"invite-to-server", "Invite to Server", RenderedMenuItem<"<guildId>", "<guildName>">>,
              RenderedMenuItem<"remove-friend", "Remove Friend">,
              RenderedMenuItem<"block", "Block">,
            ]
          }>,
          moderation: JSX.BD.Rendered<{
            children: [
              RenderedMenuItem<"mod-view", "Mod View">,
              RenderedMenuItem<"unverify-member", "Unverify Member">,
              RenderedMenuItem<"timeout", "Timeout">,
              RenderedMenuItem<"kick", "Kick">,
              RenderedMenuItem<"ban", "Ban">,
            ]
          }>,
        ];
      }>,
      dev: JSX.BD.Rendered<{
        children: JSX.BD.Rendered<RenderedMenuItem<"devmode-copy-id-<userId>", "Copy User ID"> & {
          focusedClassName?: string;
          icon: (e: any) => any;
          iconLeft: undefined;
        }>;
      }>
    ],
    navId: "user-context",
    onClose: (e: any) => void,
    onSelect: undefined;
  };
};

type UserContextMenuTargetProps = {
  config: { context: 'APP', onClose: () => void },
  context: 'APP',
  guildId?: Snowflake,
  onHeightUpdate(): void,
  position: string | 'right',
  target: HTMLButtonElement & {},
  theme: string,
  user: User
};

export type Callback = (menu: UserContextMenuFiber, targetProps: UserContextMenuTargetProps) => void;

export function PatchUserContextMenu(callback: Callback) {
  return BdApi.ContextMenu.patch('user-context', callback);
}

export default PatchUserContextMenu;