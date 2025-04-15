import { GuildMember, User, ActivityTypes, Snowflake, UserStatus } from "@discord/types";
import { Finder } from "@injections";
import { Store } from "@dium/modules/flux";

export interface ChannelMemberStore extends Store {
  getProps(guildId: Snowflake, channelId: Snowflake): {
    listId: string,
    groups: ChannelMemberGroup[],
    rows: Array<ChannelMemberRow | ChannelMemberGroup>,
    version: number;
  };
  getRows(guildId: Snowflake, channelId: Snowflake): ChannelMemberRow[];
}
export const ChannelMemberStore = Finder.byName<ChannelMemberStore>('ChannelMemberStore');

type ChannelMemberGroup = {
  count: number;
  id: string;
  index: number;
  key: string;
  title: string;
  type: 'GROUP';
};

type ChannelMemberRow = GuildMember & {
  activities: ActivityTypes[number][];
  isMobileOnline: boolean;
  isOwner: boolean;
  status: UserStatus;
  type: 'MEMBER';
  user: User;
  unusualDMActivityUntil: null;
};