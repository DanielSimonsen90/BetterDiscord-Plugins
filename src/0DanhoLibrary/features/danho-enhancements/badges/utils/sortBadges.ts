import { CustomBadgeData } from "../components/CustomBadge";
import CustomBadgesStore from "../stores/CustomBadgesStore";
import DiscordBadgeStore, { BadgeId } from "../stores/DiscordBadgeStore";
import getBadgePositions from "./getBadgePositions";

export default function sortBadges(badgeIds: Array<BadgeId | string>) {
  const badgePositions = getBadgePositions();

  const customBadgeIds = badgeIds.filter(badgeId => badgeId in CustomBadgesStore.current.customBadges)
  const discordBadgeIds = badgeIds.filter(badgeId => badgeId in DiscordBadgeStore.current)
  const sorted = [...discordBadgeIds].sort((a, b) => {
    const aPos = badgePositions.indexOf(a as BadgeId);
    const bPos = badgePositions.indexOf(b as BadgeId);
    return aPos - bPos;
  });

  for (const customBadgeId of customBadgeIds) {
    const badge = CustomBadgesStore.current.customBadges[customBadgeId];
    sorted.splice(getPosition(badge.position, sorted), 0, customBadgeId);
  }

  return sorted;
}

export function getPosition(position: CustomBadgeData['position'], badges: Array<BadgeId | string>) {
  if (position === undefined || position === 'end') return badges.length;
  if (position === 'start') return 0;
  if (typeof position === 'number') return position;

  const [startIndex, endIndex] = [position.before, position.after].map((badgeType, i) => badgeType
    ? badges.findIndex(badge => badge.toLowerCase().includes(badgeType.toLowerCase())) + (i === 0 ? 0 : 1)
    : -1
  );

  return startIndex === -1 && endIndex === -1 ? badges.length // Indexes failed; default to end
    : startIndex === -1 ? endIndex  // Start index not provided; use end index
    : endIndex === -1 ? startIndex  // End index not provided; use start index
    : position.default === undefined ? Math.max(startIndex, endIndex) - Math.min(startIndex, endIndex) // Both indexes provided; use the difference
    : position.default ?? badges.length; // Use default index if provided, otherwise use end
}