import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types";

export type PrivateChannelSidebarList = JSX.BD.FC<{}, {
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
}, JSX.BD.Memo<{
  'aria-label': "Private channels",
  className: 'privateChannels__...',
  children: [
    searchButton: JSX.BD.Rendered,
    nav: JSX.BD.Rendered<{
      children: [
        friends: JSX.BD.Rendered,
        null,
        null,
        premium: JSX.BD.Rendered,
        discordShop: JSX.BD.Rendered,
        null,
        null,
        sectionDivider: JSX.BD.Rendered,
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
export const PrivateChannelSidebarList: Record<'Z', PrivateChannelSidebarList> = Finder.findBySourceStrings("PrivateChannels", "storeLink", { defaultExport: false });
export default PrivateChannelSidebarList;