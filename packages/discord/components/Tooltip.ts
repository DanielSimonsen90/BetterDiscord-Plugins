enum Colors { BLACK, BRAND, CUSTOM, GREEN, GREY, PRIMARY, RED, YELLOW }
enum Positions { BOTTOM, CENTER, LEFT, RIGHT, WINDOW_CENTER }

export interface TooltipComponent extends React.FunctionComponent<{
  Colors?: Colors,
  // Positions?: Positions,

  text: React.ReactNode | (() => React.ReactNode),
  children: (tooltipProps: (
    & Record<'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onContextMenu', (e: React.MouseEvent<HTMLElement>) => void> 
    & Record<'onFocus' | 'onBlur', (e: React.FocusEvent<HTMLElement>) => void>
  )) => React.ReactNode,

  align?: "left" | "right",
  position?: Positions,
  color?: Colors,
  spacing?: number,
  tooltipClassName?: string,
  tooltipStyle?: React.CSSProperties,
  tooltipContentClassName?: string,
  disableTooltipPointerEvents?: boolean,
  onAnimationRest?: () => void,
  allowOverflow?: boolean,
  clickableOnMobile?: boolean,
  hideOnClick?: boolean,
  tooltipPointerClassName?: string,
  forceOpen?: boolean,
  shouldShow?: boolean,
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
  allowOverflow?: boolean;
}>;

const TooltipModule = BdApi.Components.Tooltip as any;
export const Tooltip: TooltipComponent = TooltipModule;
export const TooltipContainer: TooltipContainer = TooltipModule.TooltipContainer;
export const TooltipLayer: TooltipLayer = TooltipModule.TooltipLayer;