import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { UserBadges } from "@discord/components";

import { Badges, Settings } from "src/0DanhoLibrary/Settings";
import { CustomBadge, patchBadgeComponent, insertBadges } from "./CustomBadge";
import movePremiumBeforeBoost from "./moveNitroBadge";

export default createPatcherAfterCallback<UserProfileBadgeList<true>>(({ result }) => {
  if (!CustomBadge) return patchBadgeComponent(result);
  if (Settings.current.movePremiumBadge) movePremiumBeforeBoost(result.props);

  insertBadges(result, Object.values(Badges.current));
})