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

export default interface SystemMessage extends SystemMessageComponent {
    SystemMessageAction: React.FunctionComponent<{
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
        children?: React.ReactNode,
    }>,
    default: SystemMessageComponent
}