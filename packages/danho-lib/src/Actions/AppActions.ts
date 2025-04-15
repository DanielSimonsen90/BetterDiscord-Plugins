import { Finder } from "@injections";
import { Snowflake } from "@discord/types/base";

const navigate = Finder.bySourceStrings<(pathname: string, t?: any) => void>("transitionTo -", { defaultExport: false, searchExports: true });
const navigateToGuild = Finder.bySourceStrings<(guildId: Snowflake, channelId?: Snowflake, messageId?: Snowflake, r?: any) => void>("transitionToGuild -", { defaultExport: false, searchExports: true });

export const AppActions = {
  navigate,
  navigateToGuild,
};
export default AppActions;