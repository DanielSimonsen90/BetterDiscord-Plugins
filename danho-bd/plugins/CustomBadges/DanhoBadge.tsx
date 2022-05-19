import { CustomBadge } from './Badges';
import BDFDB from '../../libraries/BDFDB';
import React, { useEffect } from 'react';

export type BadgeProps = BDFDB['LibraryComponents']['Clickable']['defaultProps'] & {
    BDFDB: BDFDB,
    badge: CustomBadge,
}
export function DanhoBadge({ BDFDB, onClick, badge }: BadgeProps) {
    useEffect(() => {
        BDFDB.TooltipUtils.create(document.querySelector(".danho-badge"), this.props.badge.label, { side: "top" });
    }, []);

    return (
        <BDFDB.LibraryComponents.Clickable
            aria-label={badge.label}
            className={`clickable-1knRMS danho-badge ${this.props.className ?? ''}`}
            role="button"
            tabIndex={0}
            onClick={onClick}
        >
            {badge.component}
        </BDFDB.LibraryComponents.Clickable>
    )
}