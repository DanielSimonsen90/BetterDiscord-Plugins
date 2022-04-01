import { DanhoComponent } from '../../DanhoComponent'
import { CustomBadge } from './Badges';
import React from '../../libraries/React';
import BDFDB from '../../libraries/BDFDB';

export type BadgeProps = {
    badge: CustomBadge,
    className?: string,
    onClick?: (event: MouseEvent) => void
}

export function DanhoBadge(React: React, BDFDB: BDFDB) {
    return class Badge extends DanhoComponent<BadgeProps>(React) {
        componentDidMount() {
            BDFDB.TooltipUtils.create(document.querySelector(".danho-badge"), this.props.badge.label, { side: "top" });
        }

        render() {
            return this.createElement(BDFDB.LibraryComponents.Clickable, {
                "aria-label": this.props.badge.label,
                className: `clickable-1knRMS danho-badge ${this.props.className ?? ''}`,
                role: "button",
                tabIndex: 0,
                onClick: this.props.onClick,
            }, this.props.badge.component);
        }
    }
}