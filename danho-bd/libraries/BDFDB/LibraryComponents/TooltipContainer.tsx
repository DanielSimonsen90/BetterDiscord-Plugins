import { Children } from '@lib/React';
import Component from "danho-discordium/components/Component";

type TooltipContainer = Component<{
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