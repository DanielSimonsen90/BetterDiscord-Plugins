import Finder from "../../finder";

export const GuildChannelList = Finder.bySourceStrings<Record<'E', React.JSX.BD.Rendered>, true>("GuildChannelList", { module: true });

export default GuildChannelList;