import { RenderedUserProfileBadgeList } from "@discord/components";
import { Patcher } from "@dium/api";

import modifyBadges from "../../features/danho-enhancements/badges/modifyBadges";

export default function afterBadgeList() {
  Patcher.after(RenderedUserProfileBadgeList, 'Z', data => {
    modifyBadges(data);
  }, { name: 'BadgeList' });
}