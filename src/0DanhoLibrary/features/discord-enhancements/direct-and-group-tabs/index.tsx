import Finder from "@danho-lib/dium/api/finder";
import { Patcher } from "@dium";
import { Settings } from "src/0DanhoLibrary/Settings";
import PrivateChannelList from "./PrivateChannelList";
import { React } from '@react';

export { default as style } from './style.scss';

export default function Feature() {
  if (!Settings.current.directAndGroupTabs) return;

  const module = Finder.findBySourceStrings('ConnectedPrivateChannelsList', { defaultExport: false });
  if (!module) return;

  Patcher.after(module, 'Z', ({ result }) => {
    const B = result.props.children.type as React.ComponentClass<any>;
    const DanhoPrivateChannelList = PrivateChannelList(B);

    result.props.children = <DanhoPrivateChannelList {...result.props.children.props} />;
  })
}