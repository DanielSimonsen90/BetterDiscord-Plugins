import createActionCallback from "@actions/CreateActionCallback";
import { $ } from "@danho-lib/DOM";
import { wait } from "@danho-lib/Utils";

import { Logger } from "@dium";
import { React } from '@react';

import { Settings } from "src/0DanhoLibrary/Settings";

import { DUNGEON_GUILD_ID, HELLO_CHANNEL_ID } from "./constants";
import Login, { LOGIN_ID } from "./Login";
import ChannelLock from "./Lock";

let debouncedLoginRemover: NodeJS.Timeout;

export default createActionCallback('CHANNEL_SELECT', async ({ channelId, guildId }) => {
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

  const Lock = ChannelLock.instance(Settings.current.lockUnlockForMinutes, Settings.current.initialLockState);
  if (Lock.isLocked) contentContainer.insertComponent('afterbegin', <Login onSubmit={ password => {
    const correct = password === Settings.current.lockPassword;
    if(!correct) return BdApi.UI.showToast('Incorrect password', { type: 'error' });

    $(`#${LOGIN_ID}`).parent.unmount();
      Lock.unlock();
    }} />);
  })