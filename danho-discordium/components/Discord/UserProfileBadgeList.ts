import { User } from "@discord";
import Component from "../Component";

type BadgeSize = Record<`SIZE_${18  | 22 | 24}`, number>
type UserProfileBadgeListComponent = Component<{
    className?: string,
    user: User,
    premiumSince?: Date,
    premiumGuildSince?: Date,
    openPremiumSettings?: () => void,
    shinkAtCount?: number,
    shrinkToSize?: number,
    size?: number,
}>

type UserProfileBadgeList = UserProfileBadgeListComponent & {
    Sizes: BadgeSize,
    default: UserProfileBadgeListComponent
}
export default UserProfileBadgeList;