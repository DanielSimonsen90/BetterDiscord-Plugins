import { Children, Component, MouseEventHandler } from "../../React";

type Clickable = Component<{
    "aria-label"?: string,
    className?: string,
    role?: string,
    tabIndex?: number,
    children: Children,
    onClick?: MouseEventHandler,
    onContextMenu?: MouseEventHandler,
    onMouseDown?: MouseEventHandler,
    onMouseUp?: MouseEventHandler,
    onMouseEnter?: MouseEventHandler,
    onMouseLeave?: MouseEventHandler,
}>
export default Clickable;