enum Animation {
    NONE = "1",
    TRANSLATE = "2",
    SCALE = "3",
    FADE = "4"
}

enum Align { LEFT = "left", CENTER = "center", RIGHT = "right" }
// TypeScript not clever enough to know how to combine 2 enums 
enum Positions { LEFT = "left", CENTER = "center", RIGHT = "right", TOP = "top", BOTTOM = "bottom", WINDOW_CENTER = "window_center" }

type PopoutContainerChild = React.ReactElement<{
    className?: string,
    killEvent?: boolean,

    onClick?: (e: React.MouseEvent, self: PopoutContainerChild) => void,
    onContextMenu?: (e: React.MouseEvent, self: PopoutContainerChild) => void,
}>

type PopoutContainerProps = {
    children: PopoutContainerChild,
    renderPopout: (instance: React.Component<PopoutContainerProps> & { toggle(): void }) => React.ReactNode,
    align: Align,
    animation: Animation,
    position: Positions,
    
    /**@default true */
    wrap?: boolean,
    popoutClassName?: string,
    padding?: string | number,
    width?: string | number,
    open?: boolean,
    openOnContextMenu?: boolean,
    killEvent?: boolean,
    popoutStyle?: React.CSSProperties,
    arrow?: boolean,
    
    onClick?: (e: React.MouseEvent, self: PopoutContainer) => void,
    onContextMenu?: (e: React.MouseEvent, self: PopoutContainer) => void,
    onOpen?: () => void,
    onClose?: () => void,
}
export default interface PopoutContainer extends React.ComponentClass<PopoutContainerProps> {
    Animation: typeof Animation,
    Positions: typeof Positions,
    Align: typeof Align,
}