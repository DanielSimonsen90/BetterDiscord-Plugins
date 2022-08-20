import { Finder } from "@discordium/api";

enum Colors { BLACK, BRAND, CUSTOM, GREEN, GREY, PRIMARY, RED, YELLOW }
enum Positions { BOTTOM, CENTER, LEFT, RIGHT, WINDOW_CENTER }

export interface TooltipComponent extends React.FunctionComponent<{
    Colors?: Colors,
    Positions?: Positions,
    displayName: "Tooltip",
    getDerivedStateFromProps?: (e: { text?: string }, t: { shouldShowTooltip?: boolean }) => { shouldShowTooltip: boolean } | null,
}> {
    TooltipColors: Record<keyof typeof Colors, Colors>,
    TooltipContainer: TooltipContainer,
    TooltipLayer: TooltipLayer,
    TooltipPositions: Record<keyof typeof Positions, Positions>,
}

export type TooltipContainer = React.FunctionComponent<{
    children: React.ReactNode,
    className?: string,
    element?: React.ComponentType<any> | keyof HTMLElementTagNameMap,
}>;

export type TooltipLayer = React.FunctionComponent<{
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

const TooltipModule = Finder.byProps("TooltipContainer");
export const Tooltip: TooltipComponent = TooltipModule;
export const TooltipContainer: TooltipContainer = TooltipModule.TooltipContainer;
export const TooltipLayer: TooltipLayer = TooltipModule.TooltipLayer;