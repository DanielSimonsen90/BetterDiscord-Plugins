import Finder from "../../finder";

export const ChannelItem = Finder.bySourceStrings<React.JSX.BD.FC<any>, true>("tutorialId", "visible", "shouldShow", { module: true });
export default ChannelItem;
