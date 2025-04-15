import React from '@react';
import { Collapsible, GuildListItem, SearchableList } from '@components';
import { Snowflake } from '@discord/types';
import { Setter } from '@dium/settings';

import { EditLockedChannelState, LockedChannelsStore } from '../../stores';
import { ChannelLockEditForm } from '../../components/ChannelLockForm';
import { Settings, titles } from '../Settings';

type Props = {
  settings: Settings;
  set: Setter<Settings>;
  titles: typeof titles;
};

export default function LockedChannelsSettings({ settings, set, titles }: Props) {
  const guilds = LockedChannelsStore.useSettings();
  const onEditSubmit = (channelId: Snowflake) => (state: EditLockedChannelState, once: boolean) => {
    LockedChannelsStore.setLockState(channelId, state, once);
  }
  const onDeleteSubmit = (channelId: Snowflake) => () => {
    LockedChannelsStore.deleteLock(channelId);
  }

  return (
    <ul className='locked-channels-settings-list'>
      {guilds.map(({ guildId, guildName, channels }) => (
        <GuildListItem key={guildId} guildId={guildId}>
          <Collapsible 
            title={`Open to view the locked channels of ${guildName}`}
            titleOpen='Locked Channels'
          >
            <SearchableList items={channels} 
              onSearch={(search, channelInfo) => (
                channelInfo.channel.name.toLowerCase().includes(search.toLowerCase())
              )}
              renderItem={({ channel, stored, timeout }) => (
                <li key={channel.id} data-channel-id={channel.id}>
                  <Collapsible title={`#${channel.name}`} titleOpen={`Edit lock for #${channel.name}`}>
                    <ChannelLockEditForm channel={channel} 
                      onSubmit={onEditSubmit(channel.id)}
                      onDelete={onDeleteSubmit(channel.id)}
                    />
                  </Collapsible>
                </li>
              )}
              placeholder='Search for a channel...'
              noResult='No channels found'
            />
          </Collapsible>
        </GuildListItem>
      ))}
    </ul>
  );
}