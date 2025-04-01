import { Patcher } from "@dium";
import { React } from '@react';

import Finder from "@danho-lib/dium/api/finder";

import { Settings } from "src/0DanhoLibrary/Settings";

import HiddenChannelStore from "./stores/HiddenChannelStore";
import ScrollerStore from "./stores/ScrollerStore";
import GuildList from "./components/GuildList";
export { default as styles } from './styles.scss';

export default function Feature() {
  if (!Settings.current.hideChannelUntilActivity) return;
  
  HiddenChannelStore.load();
  ScrollerStore.load();

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