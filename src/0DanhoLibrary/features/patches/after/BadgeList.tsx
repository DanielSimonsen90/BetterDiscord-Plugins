import { RenderedUserProfileBadgeList } from "@discord/components";
import { Patcher } from "@dium/api";
import { Settings, Badges } from '../../../Settings/Settings';
import { CustomBadge, insertBadges, patchBadgeComponent } from '../../badges/components/CustomBadge';

export default function afterBadgeList() {
  const { badges: badgesEnabled } = Settings.current;
  if (!badgesEnabled) return;

  Patcher.after(RenderedUserProfileBadgeList, 'Z', ({ result }) => {
    if (!CustomBadge) return patchBadgeComponent(result);

    insertBadges(result, Object.values(Badges.current));
  });
}