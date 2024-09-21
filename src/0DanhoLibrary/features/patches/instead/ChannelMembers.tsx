import Finder from '@danho-lib/dium/api/finder';
import { $ } from '@danho-lib/DOM';

import { Logger, Patcher } from '@dium/api';
import { React, SelectedChannelStore, Snowflake } from '@dium/modules';

import { TabBar } from '@components/TabBar';
import { SelectedGuildStore, ChannelMemberStore, ContentInventoryStore } from '@danho-lib/Stores';

import { ActivityIndexes } from '@discord/types/user/activity';
import { Channel } from '@discord/types/channel';

import { PluginState } from '../../../Settings';

export default function insteadChannelMembers() {
  const ActivityComponent: React.MemoExoticComponent<React.FC<{
    channel: Channel;
    entry: any;
    index: number;
    requestId: string;
    type: 'CONTENT_INVENTORY';
  }>> = Finder.bySource(["requestId", "renderPopout"]);
  
  Finder.findComponentBySourceStrings('MEMBERS_LIST_LANDMARK_LABEL', 'whos-online').then(ChannelMembers => {
    Patcher.after(ChannelMembers.prototype, 'render', ({ result: memberListResult }) => {
      return React.createElement(function DanhoMemberListTabBar() {
        const [{ activeTab }, setPluginState] = PluginState.useState()
        const [members, setMembers] = React.useState([]);
        const [activities, setActivities] = React.useState([]);

        const toggleActivities = React.useCallback(() => {
          const showActivities = activeTab === 'activities';
          const membersList = $(s => s.className('tab-bar__content').tagName('div').and.role('list').and.ariaLabel('Members'));
          if (!membersList) return;

          let didHideLabel = false;
          membersList.children().map(c => ({ c,
            shouldUnmount: !showActivities && c.prop('nudgeAlignIntoViewport') && (!c.attr('style') || c.attr('style').includes('display: none')),
          })).filter(c => c.shouldUnmount).forEach(({ c }) => {
            if (!didHideLabel && !showActivities) {
              didHideLabel = true;
              c.previousSibling.setStyleProperty('display', 'none');
            } else if (showActivities) {
              c.previousSibling.setStyleProperty('display', 'unset');
            }

            showActivities ? c.setStyleProperty('display', 'unset') : c.setStyleProperty('display', 'none');
          });
        }, [activeTab]);

        React.useEffect(() => {
          const cancel = Patcher.after(ActivityComponent, 'type', toggleActivities, { silent: true });
          return () => cancel();
        }, [activeTab]);

        React.useEffect(() => {
          const channelId = SelectedChannelStore.getChannelId();
          if (!channelId) return;

          const guildId = SelectedGuildStore.getGuildId();
          if (!guildId) return;

          const setState = () => {
            const currentMembers = ChannelMemberStore.getProps(guildId, channelId).rows.filter(row => row.type === 'MEMBER');
            const currentActivities = currentMembers.filter(m => m.activities.filter(a => a.type !== ActivityIndexes.CUSTOM)).map(m => m.activities).flat(10);

            if (members.length !== currentMembers.length) setMembers(currentMembers);
            if (activities.length !== currentActivities.length) setActivities(currentActivities);
          };

          setState();
          // ChannelMemberStore.addChangeListener(setState);
        }, []);

        return (
          <TabBar onTabChange={tab => setPluginState({ activeTab: tab })} defaultTab={activeTab as 'members'} tabs={[
            ['members', `Members (${members.length})`],
            ['activities', `Activities (${activities.length})`],
          ]} 
            members={memberListResult}
            activities={() => { 
              // const feeds = ContentInventoryStore.getFeeds();
              // const activityMembers = new Set<Snowflake>(feeds.get('global feed').entries.map(entry => entry.content.participants).flat(10));
              // Logger.log({ activityMembers, feeds });
              return memberListResult;
            }}
            noContentBackground noTabsBackground 
          />
        );
      });
    }, { name: 'ChannelMemberList' });
  });
}