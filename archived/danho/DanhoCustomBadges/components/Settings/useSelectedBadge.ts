import { BadgeData } from '../../Settings/types';

const { useState, useCallback } = window.BDD.Modules.React;

type UseSelectedBadgeReturn = [badge: BadgeData, setBadge: (badge: BadgeData | ((badge: BadgeData) => BadgeData)) => void];
export default function useSelectedBadge(badges: Array<BadgeData>): UseSelectedBadgeReturn {
    const [_badge, _setBadge] = useState(undefined);
    const setBadge = useCallback((badge: BadgeData | ((badge: BadgeData) => BadgeData)) => {
        const resolvedBadge = typeof badge === 'function' ? badge(_badge) : badge;
        if (!resolvedBadge) return _setBadge(undefined);

        const foundBadge = badges.find(b => b.id === resolvedBadge.id);
        _setBadge(foundBadge);
    }, [badges]);

    return [_badge, setBadge];
}