import { React } from '@react';
import { ActionsEmitter } from "@actions";
import { Logger } from "@danho-lib/dium/api/logger";
import { $ } from "@danho-lib/DOM";

import ChannelLock from './Lock';
import Login, { LOGIN_ID } from "./Login";
import { wait } from '@danho-lib/Utils';
import { Settings } from 'src/0DanhoLibrary/Settings';

const DUNGEON_GUILD_ID = '460926327269359626';
const HELLO_CHANNEL_ID = '1303419756572835930';

let debouncedLoginRemover: NodeJS.Timeout;

export { default as style } from './style.scss';
export default function Feature() {
  const Lock = new ChannelLock(Settings.current.lockUnlockForMinutes, Settings.current.initialLockState);

  ActionsEmitter.on('CHANNEL_SELECT', async ({ channelId, guildId }) => {
    if (!channelId
      || !guildId
      || guildId !== DUNGEON_GUILD_ID
      || channelId !== HELLO_CHANNEL_ID
    ) {
      if (debouncedLoginRemover) clearTimeout(debouncedLoginRemover);
      if (document.getElementById(LOGIN_ID)) debouncedLoginRemover = setTimeout(() => document.getElementById(LOGIN_ID)?.parentElement.remove(), 100);
      return;
    }

    await wait(() => { }, 1);

    const contentContainer = $(`[class*='content']:has(> main[class*='chatContent'])`);
    if (!contentContainer) return Logger.log(`Could not find content container`, {
      get contentContainer() {
        return $(`[class*='content']:has(> main[class*='chatContent'])`);
      }
    });

    if (Lock.isLocked) contentContainer.insertComponent('afterbegin', <Login onSubmit={password => {
      const correct = password === Settings.current.lockPassword;
      if (!correct) return BdApi.UI.showToast('Incorrect password', { type: 'error' });
      
      $(`#${LOGIN_ID}`).parent.unmount();
      Lock.unlock();
    }} />);
  });
}