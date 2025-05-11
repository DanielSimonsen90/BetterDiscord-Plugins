import { Snowflake } from "@discord/types";
import Finder from "../../finder";

export type PrivateChannelSidebarList = React.JSX.BD.FC<{}, {
  theme: string,
  showLibrary: boolean,
  hasLibraryApplication: boolean,
  storeLink: null | string,
  homeLink: "/channels/@me",
  premiumTabSelected: boolean,
  isVisualRefreshEnabled: boolean,
  shouldShowNitroTab: boolean,
  shouldShowMessageRequestsRow: boolean,
  shouldShowFamilyCenterRow: boolean,
  shouldShowQuickLauncherRow: boolean,
  selectedChannelId: null | Snowflake,
  path: null;
}, React.JSX.BD.Memo<{
  'aria-label': "Private channels",
  className: 'privateChannels__...',
  children: [
    searchButton: React.JSX.BD.Rendered,
    nav: React.JSX.BD.Rendered<{
      children: [
        friends: React.JSX.BD.Rendered,
        null,
        null,
        premium: React.JSX.BD.Rendered,
        discordShop: React.JSX.BD.Rendered,
        null,
        null,
        sectionDivider: React.JSX.BD.Rendered,
        null,
      ],
      theme: string,
      showLibrary: boolean,
      hasLibraryApplication: boolean,
      storeLink: null | string,
      homeLink: "/channels/@me",
      premiumTabSelected: boolean,
      isVisualRefreshEnabled: boolean,
      shouldShowNitroTab: boolean,
      shouldShowMessageRequestsRow: boolean,
      shouldShowFamilyCenterRow: boolean,
      shouldShowQuickLauncherRow: boolean,
      selectedChannelId: null | Snowflake,
      path: null;
      onHandleScroll: undefined;
      listScrollerRef: { current: any }
    }>
  ]
}>>

export const PrivateChannelSidebarList = Finder.bySourceStrings<PrivateChannelSidebarList, true>("PrivateChannels", "storeLink", { module: true });
export default PrivateChannelSidebarList;