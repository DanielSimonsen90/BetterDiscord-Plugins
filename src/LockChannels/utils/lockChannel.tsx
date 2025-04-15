import { React } from '@react';
import { Snowflake } from "@discord/types";
import { Logger } from "@dium";

import { $ } from "@danho-lib/DOM";
import { wait } from "@danho-lib/Utils";

import { Login, LOGIN_ID } from "../components";
import { LockedChannelsStore } from '../stores';

let debouncedLoginRemover: NodeJS.Timeout;

export default async function lockChannel(channelId: Snowflake) {
  if (!channelId || LockedChannelsStore.isUnlocked(channelId)) {
    if (debouncedLoginRemover) clearTimeout(debouncedLoginRemover);
    if (document.getElementById(LOGIN_ID)) debouncedLoginRemover = setTimeout(() => document.getElementById(LOGIN_ID)?.parentElement.remove(), 100);
    return;
  }

  await wait(1);

  const contentContainer = $(s => s.className('content').directChild().and.className('page'));
  if (!contentContainer) return Logger.error(`Could not find content container`, {
    get contentContainer() {
      return $(s => s.className('content').directChild().and.className('page'));
    }
  });

  if (LockedChannelsStore.isLocked(channelId) && !document.getElementById(LOGIN_ID)) {
    contentContainer.prependComponent(<Login onSubmit={password => {
      const correct = LockedChannelsStore.login(channelId, password);
      if (!correct) return false;
      $(`#${LOGIN_ID}`).parent.unmount();
      return true;
    }} />);
  }
}