import { React, Patcher } from "@dium";
import { ConnectedPrivateChannelsList } from '@injections/patched/ConnectedPrivateChannelsList';
import PrivateChannelList from "../../components/PrivateChannelList";

export default function afterConnectedPrivateChannelsList() {
  Patcher.after(ConnectedPrivateChannelsList, 'Z', ({ result }) => {
    const B = result.props.children.type as React.ComponentClass<any>;
    const DanhoPrivateChannelList = PrivateChannelList(B);

    result.props.children = <DanhoPrivateChannelList {...result.props.children.props} />;
  }, { name: 'ConnectedPrivateChannelsList' });
}