import { findBySourceStrings } from '@danho-lib/dium/api/finder';
import { Filters, Finder, Logger, Patcher } from '@dium/api';
import { React } from '@dium/modules';

const TabBar = Finder.byKeys(["TabBar"]).TabBar;
const { Header, Item, Panel, Separator } = TabBar;

export default function insteadChannelMembers() {
  const result = findBySourceStrings('function ei', 'channel');

  Patcher.instead(result, 'Z', ({ args, original }) => {
    const MemberList = () => original(args);
    const result = React.createElement(function () {
      const [selectedItem, setSelectedItem] = React.useState('channel-member-list');
      return (<>
        <TabBar type="top" selectedItem={selectedItem} onItemSelect={e => { setSelectedItem(e); }}>
          <Item id="channel-member-list">
            {/* <MemberList /> */}
            <p>MemberList</p>
          </Item>
          <Item id="channel-activity-list">
            {/* Activities */}
            <p>Activities</p>
          </Item>
        </TabBar>
        <p>Selected {selectedItem}</p>
      </>
      );
    });

    Logger.log('MemberListTabBar', { args, result });

    return result;
  }, { name: 'ChannelMemberList' });
}