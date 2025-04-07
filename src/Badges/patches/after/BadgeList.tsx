import { BadgeList } from "@discord/components";
import { Patcher } from "@dium";

import { Settings } from '../../settings';
import movePremiumBeforeBoost from "../../utils/moveNitroBadge";
import insertBadges from "../../utils/insertBadges";

export default function afterBadgeList() {
  const { movePremiumBadge, useClientCustomBadges } = Settings.current;
  if (!movePremiumBadge && !useClientCustomBadges) return;

  Patcher.after(BadgeList, 'Z', ({ args: [props], result }) => {
    if (movePremiumBadge) movePremiumBeforeBoost(result.props);
    if (useClientCustomBadges) insertBadges(props, result);
  }, { name: 'BadgeList' })
}