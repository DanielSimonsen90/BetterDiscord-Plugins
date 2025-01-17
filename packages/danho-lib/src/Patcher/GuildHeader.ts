import Finder from "@danho-lib/dium/api/finder";
import { Guild } from "@discord/types";

export type GuildHeader = {
  type: JSX.BD.FCF<{
    animatedOverlayHeight: number;
    'aria-controls': undefined;
    'aria-expanded': false;
    bannerVisible: boolean;
    children: JSX.BD.Rendered<{
      contentTypes: Array<number>;
      guild: Guild;
      renderGuildHeaderDropdownButton: () => JSX.BD.Rendered,
      theme: string;
    }>;
  }>;
};

export const GuildHeader: GuildHeader = Finder.findBySourceStrings<GuildHeader>("hasCommunityInfoSubheader()", "ANIMATED_BANNER", "header");
export default GuildHeader;