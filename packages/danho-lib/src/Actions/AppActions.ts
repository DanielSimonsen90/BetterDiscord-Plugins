import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types/base";

const navigate = Finder.findBySourceStrings<
  (pathname: string, t?: any) => void
>("transitionTo -", { defaultExport: false, searchExports: true });
const navigateToGuild = Finder.findBySourceStrings<
  (guildId: Snowflake, channelId?: Snowflake, messageId?: Snowflake, r?: any) => void
>("transitionToGuild -", { defaultExport: false, searchExports: true });

export const AppActions = {
  navigate,
  navigateToGuild,
};
export default AppActions;