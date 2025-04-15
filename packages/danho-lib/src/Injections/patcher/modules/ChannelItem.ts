import Finder from "../../finder";

export const ChannelItem = Finder.bySourceStrings<JSX.BD.FC<any>, true>("tutorialId", "visible", "shouldShow", { module: true });
export default ChannelItem;
