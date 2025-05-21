import { React, Patcher } from "@dium";
import { ConnectedPrivateChannelsList } from '@injections/patched/ConnectedPrivateChannelsList';
import PrivateChannelList from "../../components/PrivateChannelList";
import { Logger } from "@injections";

export default function afterConnectedPrivateChannelsList() {
  Patcher.after(ConnectedPrivateChannelsList, 'Z', ({ result }) => {
    const instance = result.props.children.props.children;
    const { props, type: B } = instance as {
      props: any;
      type: React.ComponentClass<any>;
    }
    const DanhoPrivateChannelList = PrivateChannelList(B);

    result.props.children = <DanhoPrivateChannelList {...props} />;
  }, { name: 'ConnectedPrivateChannelsList' });
}