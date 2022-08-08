enum Colors { BLACK, BRAND, CUSTOM, GREEN, GREY, PRIMARY, RED, YELLOW }
enum Positions { BOTTOM, CENTER, LEFT, RIGHT, WINDOW_CENTER }

export type TooltipModule = {
    TooltipColors: Colors,
    TooltipContainer: TooltipContainer,
    TooltipLayer: TooltipLayer,
    TooltipPositions: Positions,
    default: Tooltip
}
export default TooltipModule;

type TooltipContainer = React.FunctionComponent<{
    children: React.ReactNode,
    className?: string,
    element?: React.ComponentType<any> | keyof HTMLElementTagNameMap,
}>;

type TooltipLayer = React.FunctionComponent<{
    targetElementRef: React.RefObject<HTMLElement>,
    position: Positions,
    color: Colors,
    children: React.ReactNode,
    tooltipClassName?: string,
    tooltipContentClassName?: string,
    spacing?: number,
    animationStyle?: React.CSSProperties,
    disableTooltipPointerEvnets?: boolean,
    allowOverflow?: boolean
}>

type Tooltip = React.FunctionComponent & {
    Colors: Colors,
    Positions: Positions,
    displayName: "Tooltip",
    getDerivedStateFromProps(e: { text?: string }, t: { shouldShowTooltip?: boolean }): { shouldShowTooltip: boolean } | null
}