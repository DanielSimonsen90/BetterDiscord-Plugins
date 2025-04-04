import { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { BadgeList } from "@discord/components";

import { Settings } from "src/0DanhoLibrary/Settings";
import { CustomBadge, patchBadgeComponent } from "../components/CustomBadge";
import movePremiumBeforeBoost from "../utils/moveNitroBadge";
import { insertBadges } from "../utils/insertBadges";

export default createPatcherAfterCallback<BadgeList>(({ args: [props], result }) => {
  if (!CustomBadge) return patchBadgeComponent(result);
  if (Settings.current.movePremiumBadge) movePremiumBeforeBoost(result.props);

  insertBadges(props, result);
})