import Finder from "@danho-lib/dium/api/finder";
import { Snowflake } from "@discord/types/base";
import { UserNoteStore } from "@stores";
import { ActionsEmitter } from "./ActionsEmitter";

import NetUtils from '@danho-lib/Utils/Net';
import UrlUtils from '@danho-lib/Utils/Url';
import TimeUtils, { wait } from '@danho-lib/Utils/Time';

import { Actions } from "./ActionTypes";

interface InternalUserNoteActions {
  updateNote(userId: Snowflake, note: string): void;
}

export const UserNoteActions = {
  updateNote: (userId: Snowflake, note: string) => updateNote(userId, note),
  getNote: (userId: Snowflake) => UserNoteStore.getNote(userId),
  getOrRequestNote: (userId: Snowflake, waitTimeout = 2000) => new Promise<string | undefined>(async (resolve, reject) => {
    const noteResult = UserNoteStore.getNote(userId);
    if (noteResult?.note) resolve(noteResult.note);

    ActionsEmitter.once('USER_NOTE_LOADED', (data) => resolve(data?.note?.note))
    requestNote(userId);
    TimeUtils.wait(reject, waitTimeout);
  })
}

export type UserNoteActions = typeof UserNoteActions;

export default UserNoteActions;

/**
 * Internal Discord API function to update a user's note.
 * Found using Finder.findBySourceStrings(".getNote(", "useEffect")
 */
async function requestNote(userId: Snowflake) {
  ActionsEmitter.emit('USER_NOTE_LOAD_START', { userId });

  try {
    const { body } = await NetUtils.DiscordRequester.get<Actions['USER_NOTE_LOADED']['0']['note']>({
      url: UrlUtils.DiscordEndpoints.NOTE(userId),
      oldFormErrors: true,
      rejectWithError: true,
    })
    ActionsEmitter.emit('USER_NOTE_LOADED', { note: body, userId });
  } catch {
    ActionsEmitter.emit('USER_NOTE_LOADED', { userId });
  }
}

/**
 * InternalUserNoteActions appears to be lazy-loaded
 */
async function updateNote(userId: Snowflake, note: string) {
  const InternalUserNoteActions = await new Promise<InternalUserNoteActions | undefined>((resolve, reject) => {
    Finder.findBySourceStrings(".NOTE(", "note:", 'lazy=true')
      .then(resolve)
      .catch(reject);
    wait(2000).then(reject);
  })

  if (InternalUserNoteActions?.updateNote) return InternalUserNoteActions.updateNote(userId, note);

  // Lazy module may not be loaded, so use this code which essentially is the same thing but risked to be out-dated.
  return NetUtils.DiscordRequester.put({
    url: UrlUtils.DiscordEndpoints.NOTE(userId),
    body: { note },
    oldFormErrors: false,
    rejectWithError: false,
  })
}