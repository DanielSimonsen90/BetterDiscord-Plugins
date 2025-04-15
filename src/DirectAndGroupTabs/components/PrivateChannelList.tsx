import { React } from '@react';

import { Button, NotificationBadge } from '@discord/components';
import { Channel, Snowflake } from '@discord/types';

import { ActionsEmitter, createActionCallback } from '@actions';
import { ReadStateStore } from '@stores';

import Finder from '@danho-lib/dium/api/finder';
import { Settings } from '../settings/Settings';

type Props = {
  privateChannelIds: Array<Snowflake>;
  channels: Record<Snowflake, Channel>;
  selectedChannelId: Snowflake;
  showDMHeader: boolean;
  isVisualRefreshEnabled: boolean;
};

type State = {
  totalRowCount: number;
  preRenderedChildren: number;
} & {
  selectedTab: 'direct' | 'group';
};

type RowData = {
  anchorId: undefined;
  listIndex: number;
  offsetTop: number;
  row: number;
  rowIndex: number;
  section: number;
  type: string;
};

const classModule: Record<'sectionDivider', string> = Finder.byKeys(["sectionDivider", "themedSearchBarMobile"]);

export default function PrivateChannelList(ListClass: typeof React.PureComponent<Props, State>) {
  const defaultTab = Settings.useSelector(s => s.defaultDirectAndGroupTab as State['selectedTab']);
  const [selectedTab, setSelectedTab] = React.useState(defaultTab);

  return class DanhoPrivateChannelList extends ListClass {
    componentDidMount(): void {
      super.componentDidMount();

      ActionsEmitter.on('MESSAGE_CREATE', this.onMessageCreate);
      ActionsEmitter.on('MESSAGE_ACK', this.onMessageAck);
    }
    componentWillUnmount(): void {
      ActionsEmitter.off('MESSAGE_CREATE', this.onMessageCreate);
      ActionsEmitter.off('MESSAGE_ACK', this.onMessageAck);
    }

    constructor(props: any) {
      super(props);

      this.__originalRenderDM = 'renderDM' in this ? this.renderDM : undefined;
      this.renderDM = this.patchedRenderDM.bind(this);

      this.__originalRenderSection = 'renderSection' in this ? this.renderSection : undefined;
      this.renderSection = this.patchedRenderSection.bind(this);

      this.__originalGetRowHeight = 'getRowHeight' in this ? this.getRowHeight : undefined;
      this.getRowHeight = this.patchedGetRowHeight.bind(this);
    }

    public render() {
      return (
        <>
          <div className="danho-private-channel-list__space-enabler" />
          {super.render()}
        </>
      );
    }

    declare public renderDM: (section: number, row: number) => React.ReactNode;
    private __originalRenderDM: (section: number, row: number) => React.ReactNode | undefined;
    private patchedRenderDM(section: number, row: number) {
      const { privateChannelIds, channels } = this.props;
      const channel = channels[privateChannelIds[row]];

      if (!channel) return null;
      if (channel.isMultiUserDM() && selectedTab !== 'group') return null;
      if (channel.isDM() && selectedTab !== 'direct') return null;
      return this.__originalRenderDM(section, row);
    }

    declare public renderSection: (rowData: RowData) => React.ReactNode;
    private __originalRenderSection: (rowData: RowData) => React.ReactNode | undefined;
    private patchedRenderSection(rowData: RowData) {
      const { section } = rowData;
      const { showDMHeader, channels } = this.props;

      if (section === 0 || !showDMHeader) return this.__originalRenderSection(rowData);

      const TabButton = this.renderTabButton.bind(this) as typeof this.renderTabButton;
      const getNotificationCount = (state: State['selectedTab']) => Object
        .values(channels)
        .filter(channel => state === 'group'
          ? channel.isMultiUserDM()
          : state === 'direct' && channel.isDM())
        .map(channel => channel.id)
        .filter(channelId => ReadStateStore.hasUnread(channelId))
        .reduce((acc, channelId) => acc + ReadStateStore.getUnreadCount(channelId), 0);

      return (
        <div className='tab-bar tab-bar--private-channels'>
          <header className='tab-bar__tabs'>
            <TabButton setState='direct' label='Direct' notifications={getNotificationCount('direct')} />
            <TabButton setState='group' label='Group' notifications={getNotificationCount('group')} />
          </header>
          <div className={classModule.sectionDivider} />
        </div>
      );
    }

    declare public getRowHeight: (rowData: RowData) => number;
    private __originalGetRowHeight: (rowData: RowData) => number | undefined;
    private patchedGetRowHeight(rowData: RowData) {
      const { section, row } = rowData;

      return this.renderDM(section, row) ? this.__originalGetRowHeight(rowData) : 0;
    }

    private renderTabButton(props: {
      setState: State['selectedTab'],
      label: string;
      notifications: number;
    }) {
      const { setState: state, label, notifications } = props;
      const look = state === selectedTab ? Button.Looks.LINK : Button.Looks.BLANK;

      return (
        <div className="tab-button">
          {notifications > 0 ? <NotificationBadge count={notifications} /> : null}
          <Button
            size={Button.Sizes.TINY}
            look={look}
            color={Button.Colors.TRANSPARENT}
            data-selected={state === selectedTab}
            onClick={() => setSelectedTab(state)}
          >
            {label}
          </Button>
        </div>
      );
    }

    public onMessageCreate = createActionCallback('MESSAGE_CREATE', ({ channelId }) => this.onNewMessage(channelId)).bind(this);
    public onMessageAck = createActionCallback('MESSAGE_ACK', ({ channelId }) => this.onNewMessage(channelId)).bind(this);
    private onNewMessage(channelId: Snowflake) {
      if (this.props.privateChannelIds.includes(channelId)) {
        this.forceUpdate();
      }
    }
  };
}
