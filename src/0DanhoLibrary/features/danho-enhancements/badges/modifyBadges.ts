import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { BadgeList } from "@discord/components";

import { Settings } from "src/0DanhoLibrary/Settings";
import { CustomBadge, patchBadgeComponent, insertBadges } from "./CustomBadge";
import movePremiumBeforeBoost from "./moveNitroBadge";
import CustomBadgesStore from "./stores/CustomBadgesStore";

export default createPatcherAfterCallback<BadgeList>(({ args: [props], result }) => {
  if (!CustomBadge) return patchBadgeComponent(result);
  if (Settings.current.movePremiumBadge) movePremiumBeforeBoost(result.props);

  insertBadges(props, result, Object.values(CustomBadgesStore.current));
})