import { React } from '@react';
import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { UserHeaderUsernameModule } from "@danho-lib/Patcher/UserHeaderUsername";
import { UserNoteStore } from "@stores";
import TimezoneContainer from './TimezoneContainer';

export default createPatcherAfterCallback<UserHeaderUsernameModule['Z']>(({ result, args: [props] }) => {
  const noteData = UserNoteStore.getNote(props.user.id);
  if (!noteData?.note) return result;

  const { note } = noteData;
  
  const regex = /\[(\+|\-)(\d{1,2})\]/; // [(+|-)(0-9){1,2}]
  const match = note.match(regex);
  if (!match) return result;

  const [, sign, hours] = match;
  const timezone = parseInt(hours) * (sign === '+' ? 1 : -1);

  const children = result.props.children[1].props.children;
  children.splice(children.length, 0, <TimezoneContainer timezoneHour={timezone} /> as any);
});