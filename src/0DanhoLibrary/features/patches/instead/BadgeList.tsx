import { UserProfileBadgeList, BadgeTypes } from "@discord/components";
import { Patcher } from "@dium/api";
import { Settings } from '../../../Settings/Settings';

export default function insteadBadgeList() {
  const { badges: badgesEnabled, movePremiumBadge } = Settings.current;
  if (!badgesEnabled || !movePremiumBadge) return;

  Patcher.instead(UserProfileBadgeList, 'Z', ({ args: [props], original: BadgeList }) => {
    if (movePremiumBadge) movePremiumBeforeBoost();

    return BadgeList(props);

    function movePremiumBeforeBoost() {
      const nitroBadge = props.badges.find(badge => badge.id.includes(BadgeTypes.NITRO_ANY));
      const boosterBadgePos = props.badges.findIndex(badge => badge.id.includes('booster'));

      // Ensure nitroBadge and boosterBadge exist
      if (!nitroBadge || boosterBadgePos === -1) return BadgeList(props);

      // Delete nitroBadge from badges array
      props.badges.splice(props.badges.indexOf(nitroBadge), 1);

      // Put nitroBadge before boosterBadge
      props.badges.splice(boosterBadgePos - 1, 0, nitroBadge);
    }
  }, { name: 'BadgeList' });
}