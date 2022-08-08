import { ComponentClass, Children } from "@react";

type TooltipContainer = ComponentClass<{
    allowOverflow?: boolean,
    color?: string,
    disableTooltipPoinerEvents?: boolean,
    forceOpen?: boolean,
    hideOnClick?: boolean,
    position?: 'top' | 'bottom' | 'left' | 'right',
    shouldShow?: boolean,
    spacing?: number,
    text: string,
    tooltipConfig?: any,
    children: Children
}>
export default TooltipContainer;