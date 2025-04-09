import React, { Collapsible, CollapsibleRef, useRef } from '@react';
import { Channel } from "@discord/types";

import { EditLockedChannelState, LockedChannelsStore } from '../stores';
import { ChannelLockEditForm } from './ChannelLockForm';

type Props = {
  channel: Channel;
}

export function ChannelLockModalContent({ channel }: Props) {
  const collapsibleRef = useRef<CollapsibleRef>(null);
  function onSubmit(editState: EditLockedChannelState, once: boolean) {
    LockedChannelsStore.setLockState(channel.id, editState, once);
    collapsibleRef.current?.close();
  }
  
  return (
    <Collapsible ref={collapsibleRef} title="Edit Channel Lock" 
      defaultOpen={!LockedChannelsStore.hasLock(channel.id)}
    >
      <ChannelLockEditForm onSubmit={onSubmit} channel={channel} />
    </Collapsible>
  );

}