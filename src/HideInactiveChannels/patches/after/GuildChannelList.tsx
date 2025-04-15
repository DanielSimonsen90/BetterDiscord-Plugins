import { React, Patcher } from "@dium";
import { Finder } from '@injections';
import GuildList from "../../components/GuildList";
import GuildChannelList from "@injections/patched/GuildChannelList";

export default function afterGuildChannelList() {
  Patcher.after(GuildChannelList, 'E', ({ result, args: [props] }) => {
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