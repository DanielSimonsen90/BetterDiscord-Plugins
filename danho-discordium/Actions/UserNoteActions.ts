import { Snowflake } from "@discord";
import { Finder } from "@discordium/api";

export interface UserNoteActions {
    updateNote(userId: Snowflake, note: string): void;
}
export const UserNoteActions: UserNoteActions = Finder.byProps("updateNote");
export default UserNoteActions;