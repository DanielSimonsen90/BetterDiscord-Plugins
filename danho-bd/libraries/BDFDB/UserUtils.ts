import { ActivityTypes, PermissionString, User, StatusType } from "@discord"

type UserUtils = {
    me: User,
    is(user: any): user is User,
    getStatus(id?: string): StatusType,
    getStatusColor(statis: StatusType, useColor?: boolean): string,
    getActivity(id?: string): ActivityTypes[any],
    getCustomStatus(id?: string): ActivityTypes[4],
    getAvatar(id?: string): string,
    getBanner(id?: string): string,
    can(permission: PermissionString, userId?: string, channelId?: string): boolean,
    openMenu(user: User, guildId: string, e?: MouseEvent): void
}
export default UserUtils;