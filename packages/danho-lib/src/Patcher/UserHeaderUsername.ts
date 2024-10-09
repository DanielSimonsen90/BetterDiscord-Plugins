import type { Snowflake, User, DisplayProfile } from "@discord/types";
import { Finder } from "@dium/api";
import type { TextVairants } from '@danho-lib/Patcher/Text'

type UserHeaderUsernameModule = {
  Z: (props: UserHeaderUsernameProps) => JSX.BD.Rendered<{
    className: 'container_...';
    children: [
      usernameRow: JSX.BD.Rendered<{
        className: 'usernameRow_...';
        children: [
          clickableUsername: JSX.BD.Rendered<{
            className: 'clickableUsername_...';
            onCilck: (e: any) => any;
            role: 'button';
            tabIndex: 0;
            tag: 'div';
            children: JSX.BD.Rendered<{
              children: string;
              className: 'nickname_... panel_...';
              variant: Extract<TextVairants, 'heading-lg/bold'>
            }>
          }>,
          false,
          nicknameIconsPanel: JSX.BD.Rendered<{
            className: 'nicknameIcons_... panel_...';
            children: UserHeaderUsernameProps['nicknameIcons']['props']['children'];
          }>
        ]
      }>,
      tagsPanelPronouns: JSX.BD.Rendered<{}>,
    ]
  }>
};

export const UserHeaderUsernameModule: UserHeaderUsernameModule = Finder.bySource(["USER_PROFILE_PRONOUNS", ".pronouns", "FULL_SIZE", "discriminatorClass"], { resolve: false });

type UserHeaderUsernameProps = {
  nickanme: string;
  nicknameIcons: JSX.BD.Rendered<{
    children: [
      JSX.BD.Rendered<{
        userId: Snowflake
      }>,
      JSX.BD.Rendered<{
        isHovering: boolean;
        onOpenProfile(e: any): any;
        userId: Snowflake
      }>
    ]
  }>;
  onOpenProfile(e: any): any;
  profileType: 'PANEL';
  pronouns: string;
  tags: JSX.BD.Rendered<{
    displayProfile: DisplayProfile;
    profileType: 'PANEL';
  }>;
  user: User;
}