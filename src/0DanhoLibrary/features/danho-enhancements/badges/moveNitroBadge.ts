import { BadgeTypes, BadgeList } from "@discord/components";

type Props = ReturnType<BadgeList>['props']

export function movePremiumBeforeBoost(props: Props): Props {
  const nitroBadge = props.children.find(badge => badge.props.children.props.href?.includes(BadgeTypes.NITRO_ANY));
  const boosterBadgePos = props.children.findIndex(badge => typeof badge.props.text === 'string' && badge.props.text.toLowerCase().includes('boost'));

  // Ensure nitroBadge and boosterBadge exist
  if (!nitroBadge && boosterBadgePos === -1) return props;

  // Delete nitroBadge from badges array
  props.children.splice(props.children.indexOf(nitroBadge), 1);

  // Put nitroBadge before boosterBadge
  props.children.splice(boosterBadgePos - 1, 0, nitroBadge);

  return props;
}

export default movePremiumBeforeBoost;