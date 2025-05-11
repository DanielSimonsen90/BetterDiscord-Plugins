import type { Snowflake, User, DisplayProfile } from "@discord/types";
import { Finder } from "@dium/api";
import type { TextVairants } from '@injections/patched/Text';

export type UserHeaderUsername = React.JSX.BD.FC<UserHeaderUsernameProps, {
  className: 'container_...';
  children: [
    usernameRow: React.JSX.BD.Rendered<{
      className: 'usernameRow_...';
      children: [
        clickableUsername: React.JSX.BD.Rendered<{
          className: 'clickableUsername_...';
          onCilck: (e: any) => any;
          role: 'button';
          tabIndex: 0;
          tag: 'div';
          children: React.JSX.BD.Rendered<{
            children: string;
            className: 'nickname_... panel_...';
            variant: Extract<TextVairants, 'heading-lg/bold'>;
          }>;
        }>,
        false,
        nicknameIconsPanel: React.JSX.BD.Rendered<{
          className: 'nicknameIcons_... panel_...';
          children: UserHeaderUsernameProps['nicknameIcons']['props']['children'];
        }>
      ];
    }>,
    tagsPanelPronouns: React.JSX.BD.Rendered<{
      className: 'tags__... panel__... pronouns__...';
      children: [
        tag: React.JSX.BD.Rendered<{
          className: 'clickableUsername__...',
          onClick: (e: any) => any;
          role: 'button';
          tabIndex: 0;
          tag: 'div';
          children: React.JSX.BD.Rendered<{
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
          dotSpacer: React.JSX.BD.Rendered<{}>,
          pronounsTooltip: React.JSX.BD.Rendered<{
            className: 'pronounsTooltip__...';
            delay: 300;
            text: 'Pronouns';
            children: React.JSX.BD.Rendered<{
              children: string;
              className: 'pronounsText__... userTag__...';
              color: 'header-primary';
              variant: 'text-sm/medium';
            }>;
          }>,
        ],
        clanTagContainer: React.JSX.BD.Rendered<{
          className: 'clanTag__...';
          containerClassName: 'clanTagContainer__...';
          userId: Snowflake;
        }>,
        displayProfileBadges: React.JSX.BD.Rendered<{
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
  nicknameIcons: React.JSX.BD.Rendered<{
    children: [
      React.JSX.BD.Rendered<{
        userId: Snowflake;
      }>,
      React.JSX.BD.Rendered<{
        isHovering: boolean;
        onOpenProfile(e: any): any;
        userId: Snowflake;
      }>
    ];
  }>;
  onOpenProfile(e: any): any;
  profileType: 'PANEL';
  pronouns: string;
  tags: React.JSX.BD.Rendered<{
    displayProfile: DisplayProfile;
    profileType: 'PANEL';
  }>;
  user: User;
};