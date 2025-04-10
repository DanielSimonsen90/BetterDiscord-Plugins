import { React, Patcher } from "@dium";
import Finder from "@danho-lib/dium/api/finder";
import GuildList from "../../components/GuildList";

export default function afterGuildChannelList() {
  const module = Finder.findBySourceStrings("GuildChannelList", { defaultExport: false });
  Patcher.after(module, 'E', ({ result, args: [props] }) => {
    Patcher.after(result, 'type', ({ result, args: [props] }) => {
      const efParent = result.props.children.props.children;
      const efChild = result.props.children.props.children.props.children;
      const ef = efChild.type as React.ComponentClass<any>;
      const DanhoGuildList = GuildList(ef);

      efParent.props.children = <DanhoGuildList {...efChild.props} />;
    }, { silent: true });

    return result;
  }, { name: 'GuildChannelList' });
}