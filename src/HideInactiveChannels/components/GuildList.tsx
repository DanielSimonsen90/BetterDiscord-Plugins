import React from '@react';
import { Channel } from '@discord/types';
import { ScrollerLooks } from '@discord/components';
import { ChannelListStore } from '@stores';

import { GuildUtils } from '@danho-lib/Utils';
import { $ } from '@danho-lib/DOM';

import HiddenChannelStore from '../stores/HiddenChannelStore';
import ScrollerStore from '../stores/ScrollerStore';

type RowData = {
  anchorId: undefined;
  listIndex: number;
  offsetTop: number;
  row: number;
  rowIndex: number;
  section: number;
  type: string;
};

const DISCORD_HEADER_CHANNEL_NAV_SECTION_ID = 1;
export default function GuildList(ListClass: typeof React.PureComponent<any, any>) {
  const guild = GuildUtils.current;
  const guildFeatures = GuildUtils.useGuildFeatures(guild);

  return class DanhoGuildChannelList extends ListClass {
    private instanceRef = React.createRef<HTMLDivElement>();
    private timeout: NodeJS.Timeout | null = null;

    componentDidMount(): void {
      this.updateScroll();
      super.componentDidMount();

      this.timeout = setTimeout(() => {
        this.updateHeight();
      });
    }
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any): void {
      this.updateScroll();
      super.componentDidUpdate(prevProps, prevState, snapshot);
    }
    componentWillUnmount(): void {
      super.componentWillUnmount();
      if (this.timeout) clearTimeout(this.timeout);
    }

    constructor(props: any) {
      super(props);

      this.__originalRenderRow = 'renderRow' in this ? this.renderRow : undefined;
      this.renderRow = this.patchedRenderRow.bind(this);

      this.__originalGetRowHeight = 'getRowHeight' in this ? this.getRowHeight : undefined;
      this.getRowHeight = this.patchedGetRowHeight.bind(this);

      this.__originalRenderSection = 'renderSection' in this ? this.renderSection : undefined;
      this.renderSection = this.patchedRenderSection.bind(this);

      this.handleListScroll = this.onScroll.bind(this);
      HiddenChannelStore.addListener(state => {
        const guild = state.guilds[props.guild.id];
        if (guild) this.forceUpdate();
      })
    }

    declare public _list: {
      getItems(): Array<RowData>;
      getScrollPosition(): unknown;
    };

    private _scrollState = ScrollerStore.getInstance();

    public render() {
      return (
        <div className={ScrollerLooks.thin} style={{
          overflow: 'hidden scroll',
          maxHeight: '100%',
        }} onScroll={this.onScroll.bind(this)} ref={this.instanceRef}>
          {super.render()}
        </div>
      );
    }

    declare public handleListScroll: (e: React.UIEvent) => void;
    public onScroll(e: React.UIEvent) {
      if (!e) return;

      this._scrollState.update(e.currentTarget.scrollTop);
    }
    public updateScroll() {
      if (this.instanceRef.current) {
        this.instanceRef.current.scrollTop = this._scrollState.getScrollState();
      }
    }

    public updateHeight() {
      const channelsList = $(s => s.ariaLabel('Channels', 'ul'));
      channelsList.setStyleProperty('height', 'auto');

      const userArea = $(s => s.ariaLabel('User area', 'section').and.className('panels'));
      const userAreaHeight = userArea?.element.clientHeight ? `${userArea.element.clientHeight}px` : '1rem';
      channelsList.setStyleProperty('paddingBottom', `calc(${userAreaHeight} + 0px)`);
    }

    declare public renderRow: (row: RowData) => any;
    private __originalRenderRow: (row: any) => any;
    public patchedRenderRow(rowData: RowData) {
      const { section, row } = rowData;
      const channelResult = this.runOriginalChecks(
        section,
        row,
        () => this.__originalRenderRow(rowData),
        true
      );

      if (!this.isChannelResult(channelResult)) return channelResult;
      const { channel } = channelResult;

      return HiddenChannelStore.shouldRenderChannel(channel.id)
        ? this.__originalRenderRow(rowData)
        : null;
    }

    declare public renderSection: (data: RowData) => any;
    private __originalRenderSection: (data: RowData) => JSX.BD.Rendered;
    public patchedRenderSection(data: RowData) {
      const rendered = this.__originalRenderSection(data);
      if (!rendered.key.includes('category')) return rendered;

      const categoryChannelId = rendered.key.split('-').pop();
      return HiddenChannelStore.shouldRenderChannel(categoryChannelId) ? rendered : null;
    }

    declare public getRowHeight: (section: RowData['section'], row: RowData['row']) => number;
    private __originalGetRowHeight: (section: RowData['section'], row: RowData['row']) => number;
    public patchedGetRowHeight(section: RowData['section'], row: RowData['row']) {
      const channelResult = this.runOriginalChecks(
        section,
        row,
        () => this.__originalGetRowHeight(section, row)
      );
      if (!this.isChannelResult(channelResult)) return channelResult;

      const { channel } = channelResult;
      return HiddenChannelStore.shouldRenderChannel(channel.id)
        ? this.__originalGetRowHeight(section, row)
        : 0;

    }

    private runOriginalChecks<TResult>(
      section: RowData['section'],
      row: RowData['row'],
      original: () => TResult,
      runPlaceholderCheck = false
    ) {
      const { guild } = this.props;
      const channelList = ChannelListStore.getGuild(guild.id, guildFeatures);

      if (section === DISCORD_HEADER_CHANNEL_NAV_SECTION_ID) return original();
      else if (runPlaceholderCheck && channelList.guildChannels.isPlaceholderRow(section, row)) return original();

      const channelResult = channelList.guildChannels.getChannelFromSectionRow(section, row);
      if (!channelResult) return original();

      return channelResult;
    }
    private isChannelResult(result: unknown): result is { channel: Channel; } {
      return typeof result === 'object' && result !== null && 'channel' in result;
    }
  };
}