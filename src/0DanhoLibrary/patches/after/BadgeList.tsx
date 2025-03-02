import { BadgeList } from "@discord/components";
import { Patcher } from "@dium/api";

import modifyBadges from "../../features/danho-enhancements/badges/modifyBadges";
import { Settings } from "src/0DanhoLibrary/Settings";

export default function afterBadgeList() {
  if (!Settings.current.badges) return;

  Patcher.after(BadgeList, 'Z', data => {
    if (Settings.current.badges) modifyBadges(data);
  }, { name: 'BadgeList' });
}