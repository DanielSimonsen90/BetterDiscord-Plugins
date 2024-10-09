import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types/base";

const navigate = Finder.findBySourceStrings("transitionTo -", { defaultExport: false, searchExports: true }) as (pathname: string, t?: any) => void;
const navigateToGuild = Finder.findBySourceStrings("transitionToGuild -", { defaultExport: false, searchExports: true }) as (guildId: Snowflake, channelId?: Snowflake, messageId?: Snowflake, r?: any) => void;

export const AppActions = {
  navigate,
  navigateToGuild,
}
export default AppActions;