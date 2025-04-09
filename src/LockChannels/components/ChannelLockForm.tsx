import React, { useState, useMemo, FormItemFromModel } from '@react';
import { Channel } from '@discord/types';
import { Button } from '@discord/components';
import { ObjectUtils } from '@danho-lib/Utils';

import { LockedChannelsStore, EditLockedChannelState } from '../stores';
import { Settings } from '../settings/Settings';

type Props = {
  channel: Channel;
  onSubmit(state: EditLockedChannelState, once: boolean): void;
  onDelete?: () => void;
};

export function ChannelLockEditForm({ channel, onSubmit, onDelete }: Props) {
  const settings = Settings.useCurrent();
  const lockedChannel = LockedChannelsStore.useSelector(state => state.channels[channel.id]);
  const defaultState = useMemo<EditLockedChannelState>(() => ({
    initialLockState: lockedChannel?.initialLockState || settings.initialLockState,
    password: lockedChannel?.password,
    unlockedForMinutes: lockedChannel?.unlockedForMinutes || settings.unlockedForMinutes,
  }), [lockedChannel, settings]);
  const [state, setState] = useState<EditLockedChannelState>(defaultState);
  const hasChanges = useMemo(() => !ObjectUtils.isEqual(defaultState, state), [state, defaultState]);

  return (
    <form className='lock-channel-form' onSubmit={e => {
      e.preventDefault();
      onSubmit(state, true);
    }}>
      <FormItemFromModel model={state} property='initialLockState' onModelChange={model => setState(model)} required />
      <FormItemFromModel model={state} property='unlockedForMinutes' onModelChange={model => setState(model)} required />
      <FormItemFromModel model={state} property='password' onModelChange={model => setState(model)} required type='password' ephemeralEyeSize={32} />
      <div className="button-panel">
        {onDelete && (
          <Button type="button" look={Button.Looks.OUTLINED} color={Button.Colors.RED} onClick={onDelete}>
            Delete Lock
          </Button>
        )}
        <Button type="submit" look={Button.Looks.OUTLINED} color={Button.Colors.BRAND} disabled={!hasChanges} onClick={() => onSubmit(state, false)}>
          Lock and Save
        </Button>
        <Button type="submit" look={Button.Looks.FILLED} color={Button.Colors.BRAND} disabled={!hasChanges}>
          Lock
        </Button>
      </div>
    </form>
  );
}