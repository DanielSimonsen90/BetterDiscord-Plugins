import { ComponentClass, MouseEventHandler, Children } from "@react";

type Clickable = ComponentClass<{
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