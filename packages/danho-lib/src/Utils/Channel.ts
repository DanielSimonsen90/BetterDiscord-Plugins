import { ChannelStore, SelectedChannelStore } from '@discord/stores';
import { Channel, Snowflake } from '@discord/types';

export const ChannelUtils = {
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

export default ChannelUtils;