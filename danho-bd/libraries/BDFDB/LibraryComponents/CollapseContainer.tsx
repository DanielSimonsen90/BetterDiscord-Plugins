import React, { Component, Children, MouseEventHandler } from "@lib/React";
import BDFDB from "../BDFDB";

type CollapseContainer = Component<{
    title: string,
    collapseStates: { [title: string]: boolean },
    children: Children,
    className?: string,
    collapsed?: boolean,
    id?: string,
    mini?: boolean,
    
    onClick?: MouseEventHandler,
}>
export default CollapseContainer;

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