import { Logger, Patcher, React } from "@dium";
import { UserHeaderUsernameModule } from "@danho-lib/Patcher/UserHeaderUsername";
import { UserNoteStore } from "@stores";

import { BirthdayContainer } from "../../components";
import BirthdayStore from "../../stores/BirthdayStore";
import { BIRTHDAY_REGEX, getBirthdate } from "../../utils/constants";

export default function afterUserHeaderUsername() {
  Patcher.after(UserHeaderUsernameModule, 'Z', ({ result, args: [props] }) => {
    const noteData = UserNoteStore.getNote(props.user.id);
    if (!noteData?.note) return result;

    const { note } = noteData;
    const birthdate = BirthdayStore.getBirthdateFromNote(note, props.user.id);
    if (!birthdate) return result;

    const children = result.props.children[1].props.children;
    children.splice(children.length, 0, <BirthdayContainer birthdate={birthdate} /> as any);
  }, { name: 'UserHeaderUsername' });
}