import { UserProfileBadgeList } from "@discord/components";
import { Patcher } from "@injections";

import { Settings } from '../../settings';
import movePremiumBeforeBoost from "../../utils/moveNitroBadge";
import insertBadges from "../../utils/insertBadges";

export default function afterBadgeList() {
  const { movePremiumBadge, useClientCustomBadges } = Settings.current;
  if (!movePremiumBadge && !useClientCustomBadges) return;

  Patcher.after(UserProfileBadgeList, 'Z', ({ args: [props], result }) => {
    if (movePremiumBadge) movePremiumBeforeBoost(result.props);
    if (useClientCustomBadges) insertBadges(props, result);
  }, { name: 'UserProfileBadgeList' });
}