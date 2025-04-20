import { Component, ReactNode, UIEvent } from '@react';
import Finder from "../../finder";
import { Channel, DisplayProfile, GuildMember, RowData, User } from '@discord/types';
import { Autocomplete } from '@utils/types';
import { Snowflake } from '@dium/modules';
import { ChannelMemberGroup, ChannelMemberRow } from '@discord/stores/ChannelStores/ChannelMemberStore';

export type ChannelMembersList = typeof Component<{
  channel: Channel;
  groups: Array<Group>;
  rows: Array<Group | ChannelMemberRow>;
  listId: string;
}> & {
  new(...args: any[]): {
    _list: any;
    getDimensions(): {
      y: number;
      height: number;
      rowHeight: number;
      rowsVisible?: number;
    };
    renderSection(data: RowData): ReactNode;
    renderRow(data: RowData): ReactNode;
    getRowProps(data: RowData): RowProps;
    handleScroll(event: UIEvent): void;
    getContentFeedGroup(): unknown;
    hasContentFeed(): boolean;
    getRowHeightComputer(): number;
    getContentFeedHeight(): number;
    updateSubscription(): void;
    trackMemberListViewed(): void;
  };
}

export const ChannelMembersList = Finder.findComponentBySourceStrings<ChannelMembersList>("ChannelMembers");
export const ChannelMembersListContainer = Finder.findComponentBySourceStrings("ChannelMembers", 'id:"members-"');
export default ChannelMembersList;

type Group = ChannelMemberGroup | {
  expanded: boolean;
  expandedCount: number;
  feedHeight: number;
  onToggleExpand(): void;
  type: 'CONTENT_INVENTORY_GROUP'
}

type RowProps = {
  entry: {
    author_id: Snowflake;
    author_type: 1;
    content_type: 1;
    ended_at: string;
    extra: {
      application_id: Snowflake;
      game_name: string;
      platform: number;
      type: "played_game_extra"
    },
    id: Snowflake;
    participants: Array<Snowflake>;
    signature: {
      kid: string;
      signature: string;
      version: number;
    }
    started_at: string;
    traits?: Array<{
      type: 1 | 2 | 6;
      duration_seconds?: number;
      first_time?: boolean;
      marathon?: boolean;
    }>
  },
  requestId: string;
  type: 'CONTENT_INVENTORY'
} | ChannelMemberRow;