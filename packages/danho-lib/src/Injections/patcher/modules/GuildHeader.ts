import { Guild } from "@discord/types";
import Finder from "../../finder";

export type GuildHeader = {
  type: React.JSX.BD.FCF<{
    animatedOverlayHeight: number;
    'aria-controls': undefined;
    'aria-expanded': false;
    bannerVisible: boolean;
    children: React.JSX.BD.Rendered<{
      contentTypes: Array<number>;
      guild: Guild;
      renderGuildHeaderDropdownButton: () => React.JSX.BD.Rendered,
      theme: string;
    }>;
  }>;
};

export const GuildHeader: GuildHeader = Finder.bySourceStrings<GuildHeader>("hasCommunityInfoSubheader()", "ANIMATED_BANNER", "header");

export default GuildHeader;