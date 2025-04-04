import { BadgeList } from "@discord/components";
import { Patcher } from "@dium/api";

import { Settings } from "src/0DanhoLibrary/Settings";
import modifyBadges from "src/0DanhoLibrary/features/danho-enhancements/badges/patches/modifyBadges";

export default function afterBadgeList() {
  if (!Settings.current.badges) return;

  Patcher.after(BadgeList, 'Z', data => {
    if (Settings.current.badges) modifyBadges(data);
  }, { name: 'BadgeList' });
}