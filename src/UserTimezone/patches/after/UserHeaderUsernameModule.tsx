import { Patcher, React } from "@dium";
import { UserNoteStore } from "@discord/stores";
import { UserHeaderUsernameModule } from "@injections/patched/UserHeaderUsername";
import { TimezoneContainer } from "../../components";

export default function afterUserHeaderUsernameModule() {
  Patcher.after(UserHeaderUsernameModule, 'Z', ({ result, args: [props] }) => {
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
  }, { name: 'UserHeaderUsername' });
}