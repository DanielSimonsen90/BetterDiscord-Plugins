import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { UserHeaderUsernameModule } from "@danho-lib/Patcher/UserHeaderUsername";
import { UserNoteStore } from "@stores";
import { React } from "@react";
import { BIRTHDAY_REGEX, getBirthdate } from "../constants";
import BirthdayContainer from "../components/BirthdayContainer";
import BirthdayStore from "../BirthdayStore";
import { Logger } from "@dium";

export default createPatcherAfterCallback<UserHeaderUsernameModule['Z']>(({ result, args: [props] }) => {
  const noteData = UserNoteStore.getNote(props.user.id);
  if (!noteData?.note) return result;

  const { note } = noteData;
  
  const match = note.match(BIRTHDAY_REGEX);
  if (!match) return result;

  const [birthdate] = match;
  
  if (BirthdayStore.current[props.user.id]?.toString() !== getBirthdate(birthdate).toString()) {
    BirthdayStore.update({ [props.user.id]: getBirthdate(birthdate).toString() });
    Logger.log(`[BirthdayStore (appendUserBirthday)] Added birthday for ${props.user.id}`);
  }

  const children = result.props.children[1].props.children;
  children.splice(children.length, 0, <BirthdayContainer birthdate={birthdate} /> as any);
});