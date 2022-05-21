import { Snowflake, User } from "@discord";
import { PatchProps } from "../PatchTypes";

export type UserActivity = Pick<PatchProps['UserPopoutBody'], 'activity' | 'channelId'> & {
    channelId: Snowflake,
    className: string,
    guildId: Snowflake,
    onAction: () => void,
    onOpenGameProfile: () => void,
    source: "Profile Popout",
    type: "UserPopout",
    user: User,
}
export default UserActivity;