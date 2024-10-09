import { GuildMember } from "@discord/types/guild/member";
import { User } from "@discord/types/user";
import { ActivityTypes } from "@discord/types/user/activity";
import { Snowflake } from "@dium/modules";
import { Store } from "@dium/modules/flux";
import { Finder } from "@dium/api";
import { UserStatus } from "@discord/types/user/status";

export interface ChannelMemberStore extends Store {
  getProps(guildId: Snowflake, channelId: Snowflake): {
    listId: string,
    groups: ChannelMemberGroup[],
    rows: Array<ChannelMemberRow | ChannelMemberGroup>,
    version: number;
  };
  getRows(guildId: Snowflake, channelId: Snowflake): ChannelMemberRow[];
}
export const ChannelMemberStore: ChannelMemberStore = Finder.byName('ChannelMemberStore');

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