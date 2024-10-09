import {
  ChannelStore,
  GuildChannelStore,
  SelectedChannelStore
} from '@stores/index';
import { BetterOmit } from './types';
import { FilterStore } from './types';
import { Channel } from '@dium/modules/channel';
import { Snowflake } from '@discord/types/base';

type CompiledChannelUtils = BetterOmit<
  & FilterStore<ChannelStore>
  & FilterStore<GuildChannelStore>
  & FilterStore<SelectedChannelStore>
  , '__getLocalVars'> & {
    get current(): Channel | null;
    get currentChannelId(): Snowflake | null;

    getUrl(channel: Channel): string;
    getUrl(channelId: Snowflake, guildId?: Snowflake | '@me'): string;
    getMessageUrl(channelId: Snowflake, messageId: Snowflake, guildId?: Snowflake | '@me'): string;
  };

export const ChannelUtils: CompiledChannelUtils = {
  ...ChannelStore,
  ...GuildChannelStore,
  ...SelectedChannelStore,

  get current() {
    return ChannelStore.getChannel(SelectedChannelStore.getChannelId());
  },
  get currentChannelId() {
    return SelectedChannelStore.getChannelId();
  },

  getUrl(channelResolve: Channel | Snowflake, guildId?: Snowflake | '@me') {
    const channel = typeof channelResolve === 'string' ? ChannelStore.getChannel(channelResolve) : channelResolve;
    if (!channel) return '';
    guildId ??= channel.getGuildId() ?? '@me';

    return `https://discord.com/channels/${guildId}/${channel.id}`;
  },
  getMessageUrl(channelId: Snowflake, messageId: Snowflake, guildId: Snowflake | '@me' = '@me') {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
  }
};