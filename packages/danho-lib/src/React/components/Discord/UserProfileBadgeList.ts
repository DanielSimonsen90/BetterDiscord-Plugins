import type { User } from '@discord/types/user';
import { Finder } from "@dium/api";

type BadgeSize = Record<`SIZE_${18  | 22 | 24}`, number>

export interface UserProfileBadgeList extends React.FunctionComponent<{
    className?: string,
    user: User,
    premiumSince?: Date,
    premiumGuildSince?: Date,
    openPremiumSettings?: () => void,
    shinkAtCount?: number,
    shrinkToSize?: number,
    size?: number,
}> {
    Sizes: BadgeSize
}
export const UserProfileBadgeList: UserProfileBadgeList = Finder.byName("UserProfileBadgeList");
export default UserProfileBadgeList;