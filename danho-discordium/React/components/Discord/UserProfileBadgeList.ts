import { User } from "@discord";
import { FunctionComponent } from "../../";

type BadgeSize = Record<`SIZE_${18  | 22 | 24}`, number>
type UserProfileBadgeListComponent = FunctionComponent<{
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