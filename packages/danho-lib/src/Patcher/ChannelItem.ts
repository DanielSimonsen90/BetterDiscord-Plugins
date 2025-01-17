import Finder from "@danho-lib/dium/api/finder";

export const ChannelItem = Finder.findBySourceStrings("tutorialId", "visible", "shouldShow", { defaultExport: false }) as {
  Z: JSX.BD.FC<any>; // TODO: Fix this type
};

export default ChannelItem;