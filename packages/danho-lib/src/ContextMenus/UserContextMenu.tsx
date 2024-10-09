import { User } from "@discord/types/user";

type UserContextMenuFiber = {
  props: {
    "aria-label": "User Settings Actions",
    children: [
      JSX.BD.Rendered<{
        children: [
          JSX.BD.Rendered<{ children: null; }>,
          JSX.BD.Rendered<{
            children: [
              MenuItem<"user-profile", "Profile">,
              MenuItem<"message-user", "Message">,
              MenuItem<"call", "Call">,
              MenuItem<"note", "Edit Note">,
              MenuItem<"add-friend-nickname", "Add Friend Nickname">,
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
                children: Array<JSX.BD.Rendered<MenuItem<"<guildId>", "<guildName>">>>;
              }>,
              MenuItem<"remove-friend", "Remove Friend">,
              MenuItem<"block", "Block">,
            ]
          }>
        ];
      }>,
      JSX.BD.Rendered<{
        children: JSX.BD.Rendered<MenuItem<"devmode-copy-id-<userId>", "Copy User ID"> & {
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

type MenuItem<id, label, action = (() => void)> = JSX.BD.Rendered<{
  action: action,
  id: id,
  label: label,
}>

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