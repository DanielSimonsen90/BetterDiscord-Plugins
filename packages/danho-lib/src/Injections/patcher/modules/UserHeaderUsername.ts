import type { Snowflake, User, DisplayProfile } from "@discord/types";
import { Finder } from "@dium/api";
import type { TextVairants } from '@injections/patched/Text';

export type UserHeaderUsername = JSX.BD.FC<UserHeaderUsernameProps, {
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
            variant: Extract<TextVairants, 'heading-lg/bold'>;
          }>;
        }>,
        false,
        nicknameIconsPanel: JSX.BD.Rendered<{
          className: 'nicknameIcons_... panel_...';
          children: UserHeaderUsernameProps['nicknameIcons']['props']['children'];
        }>
      ];
    }>,
    tagsPanelPronouns: JSX.BD.Rendered<{
      className: 'tags__... panel__... pronouns__...';
      children: [
        tag: JSX.BD.Rendered<{
          className: 'clickableUsername__...',
          onClick: (e: any) => any;
          role: 'button';
          tabIndex: 0;
          tag: 'div';
          children: JSX.BD.Rendered<{
            className: 'userTag__...';
            discriminatorClass: 'userTagDiscriminator__...';
            forcePomelo: undefined;
            forceUsername: true;
            hideBotTag: boolean;
            user: User;
            usernameClass: 'userTagUsername__...';
            usernameIcon: undefined;
          }>;
        }>,
        pronounsContainer: [
          dotSpacer: JSX.BD.Rendered<{}>,
          pronounsTooltip: JSX.BD.Rendered<{
            className: 'pronounsTooltip__...';
            delay: 300;
            text: 'Pronouns';
            children: JSX.BD.Rendered<{
              children: string;
              className: 'pronounsText__... userTag__...';
              color: 'header-primary';
              variant: 'text-sm/medium';
            }>;
          }>,
        ],
        clanTagContainer: JSX.BD.Rendered<{
          className: 'clanTag__...';
          containerClassName: 'clanTagContainer__...';
          userId: Snowflake;
        }>,
        displayProfileBadges: JSX.BD.Rendered<{
          displayProfile: DisplayProfile;
          profileType: 'PANEL';
        }>
      ];
    }>,
  ];
}>;

export type UserHeaderUsernameModule = {
  Z: UserHeaderUsername;
};

// TODO: Try move this into custom finder
export const UserHeaderUsernameModule: UserHeaderUsernameModule = Finder.bySource([".pronouns", "discriminatorClass"], { resolve: false })
export default UserHeaderUsernameModule;

type UserHeaderUsernameProps = {
  nickanme: string;
  nicknameIcons: JSX.BD.Rendered<{
    children: [
      JSX.BD.Rendered<{
        userId: Snowflake;
      }>,
      JSX.BD.Rendered<{
        isHovering: boolean;
        onOpenProfile(e: any): any;
        userId: Snowflake;
      }>
    ];
  }>;
  onOpenProfile(e: any): any;
  profileType: 'PANEL';
  pronouns: string;
  tags: JSX.BD.Rendered<{
    displayProfile: DisplayProfile;
    profileType: 'PANEL';
  }>;
  user: User;
};