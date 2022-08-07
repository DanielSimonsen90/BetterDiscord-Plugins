import { NoteSection } from "./Note"
import { RolesSection } from "./roles"
import UserActivity from "./UserActivity"

export type UserPopoutBody = {
    children: [
        userActivity: React.ReactElement<UserActivity>,
        rolesSection: React.ReactElement<RolesSection>,
        note: React.ReactElement<NoteSection>
    ],
    className: string,
}
export default UserPopoutBody;