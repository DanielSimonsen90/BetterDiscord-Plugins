import React from '../../React';
import { Snowflake } from '@discord/types';
import { ChannelStore } from '@discord/stores';

type ChannelMentionProps = {
  id: Snowflake;
  onClick?: (event: React.MouseEvent) => void;
}

export function ChannelMention({ id, onClick }: ChannelMentionProps) {
  const channel = ChannelStore.getChannel(id);
  return <span className="channel-mention" onClick={onClick}>{channel.name}</span>;
}

export default ChannelMention;