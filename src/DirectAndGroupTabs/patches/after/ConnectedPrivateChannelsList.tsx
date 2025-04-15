import { React, Patcher } from "@dium";
import Finder from "@danho-lib/dium/api/finder";
import PrivateChannelList from "../../components/PrivateChannelList";

export default function afterConnectedPrivateChannelsList() {
  const ConnectedPrivateChannelsList = Finder.findBySourceStrings('ConnectedPrivateChannelsList', { defaultExport: false });
  if (!ConnectedPrivateChannelsList) return;

  Patcher.after(ConnectedPrivateChannelsList, 'Z', ({ result }) => {
    const B = result.props.children.type as React.ComponentClass<any>;
    const DanhoPrivateChannelList = PrivateChannelList(B);

    result.props.children = <DanhoPrivateChannelList {...result.props.children.props} />;
  }, { name: 'ConnectedPrivateChannelsList' });
}