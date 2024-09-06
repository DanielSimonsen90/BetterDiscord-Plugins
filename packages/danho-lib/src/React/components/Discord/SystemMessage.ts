import { Finder } from "@dium/api"

type SystemMessageComponent = React.FunctionComponent<{
    icon?: string,
    iconNode?: React.ReactNode,
    timestamp?: number,
    className?: string,
    children?: React.ReactNode,
    contentClassName?: string,
    iconClassName?: string,
    iconContainerClassName?: string,
    compact?: boolean
}>

export interface SystemMessage extends SystemMessageComponent {
    SystemMessageAction: React.FunctionComponent<{
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
        children?: React.ReactNode,
    }>,
    default: SystemMessageComponent
}
export const SystemMessage: SystemMessage = Finder.byName("SystemMessage");
export default SystemMessage;