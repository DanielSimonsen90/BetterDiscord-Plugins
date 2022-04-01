import { Component, MouseEventHandler } from "../../React";

type Clickable = Component<{
    className?: string,
    onClick?: MouseEventHandler,
    onContextMenu?: MouseEventHandler,
    onMouseDown?: MouseEventHandler,
    onMouseUp?: MouseEventHandler,
    onMouseEnter?: MouseEventHandler,
    onMouseLeave?: MouseEventHandler,
}>
export default Clickable;