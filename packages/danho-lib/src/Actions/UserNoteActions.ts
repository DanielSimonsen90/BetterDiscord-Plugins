import { Snowflake } from "@discord/types/base";
import { Finder } from "@dium/api";

export interface UserNoteActions {
  updateNote(userId: Snowflake, note: string): void;
}
export const UserNoteActions: UserNoteActions = Finder.byKeys(["updateNote"]); // WARN: Might be outdated
export default UserNoteActions;