import { User } from "@discord/types/user";
import { RenderedMenuItem } from "./Builder.types";

type UserContextMenuFiber = {
  props: {
    "aria-label": "User Settings Actions",
    children: [
      JSX.BD.Rendered<{
        children: [
          JSX.BD.Rendered<{ children: null; }>,
          JSX.BD.Rendered<{
            children: [
              RenderedMenuItem<"user-profile", "Profile">,
              RenderedMenuItem<"message-user", "Message">,
              RenderedMenuItem<"call", "Call">,
              RenderedMenuItem<"note", "Edit Note">,
              RenderedMenuItem<"add-friend-nickname", "Add Friend Nickname">,
              null
            ];
          }>,
          false,
          JSX.BD.Rendered<{ children: []; }>,
          JSX.BD.Rendered<{
            children: [
              false,
              JSX.BD.Rendered<{
                id: 'invite-to-server',
                label: 'Invite to Server',
                children: Array<JSX.BD.Rendered<RenderedMenuItem<"<guildId>", "<guildName>">>>;
              }>,
              RenderedMenuItem<"remove-friend", "Remove Friend">,
              RenderedMenuItem<"block", "Block">,
            ]
          }>
        ];
      }>,
      JSX.BD.Rendered<{
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
  onHeightUpdate(): void,
  position: string | 'right',
  target: HTMLButtonElement & {},
  theme: string,
  user: User
};

type Callback = (menu: UserContextMenuFiber, targetProps: UserContextMenuTargetProps) => void;

export function PatchUserContextMenu(callback: Callback) {
  return BdApi.ContextMenu.patch('user-context', callback);
}

export default PatchUserContextMenu;