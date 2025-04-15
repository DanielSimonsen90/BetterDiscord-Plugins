import Finder from "../../finder";

export const GuildChannelList = Finder.bySourceStrings<Record<'E', JSX.BD.Rendered>, true>("GuildChannelList", { module: true });

export default GuildChannelList;