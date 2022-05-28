import { Children, MouseEventHandler } from "@lib/React";
import Component from "danho-discordium/components/Component";

type Clickable = Component<{
    "aria-label"?: string,
    className?: string,
    role?: string,
    tabIndex?: number,
    children: Children,
    onClick?: MouseEventHandler<HTMLDivElement>,
    onContextMenu?: MouseEventHandler<HTMLDivElement>,
    onMouseDown?: MouseEventHandler<HTMLDivElement>,
    onMouseUp?: MouseEventHandler<HTMLDivElement>,
    onMouseEnter?: MouseEventHandler<HTMLDivElement>,
    onMouseLeave?: MouseEventHandler<HTMLDivElement>,
}>
export default Clickable;