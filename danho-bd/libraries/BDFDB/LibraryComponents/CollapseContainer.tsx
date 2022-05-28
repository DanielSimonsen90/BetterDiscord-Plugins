import React, { Children, MouseEventHandler } from "@lib/React";
import Component from "danho-discordium/components/Component";

type CollapseContainer = Component<{
    title: string,
    collapseStates: { [title: string]: boolean },
    children: Children,
    className?: string,
    collapsed?: boolean,
    id?: string,
    mini?: boolean,

    onClick?: MouseEventHandler<HTMLDivElement>,
}>
export default CollapseContainer;

declare const BDFDB: typeof window.BDFDB

export function CollapseContianerComponent(props: CollapseContainer["defaultProps"]) {
    return (
        <div className={BDFDB.DOMUtils.formatClassName(
            props.collapsed && BDFDB.disCN.collapsecontainercollapsed,
            props.mini ? BDFDB.disCN.collapsecontainermini : BDFDB.disCN.collapsecontainer,
            props.className
        )}>

        </div>
    )
}