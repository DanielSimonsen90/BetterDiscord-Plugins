import { User } from "@discord/types/user";
import { PatchProps } from "../PatchTypes";
import { Snowflake } from "@discord/types/base";

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