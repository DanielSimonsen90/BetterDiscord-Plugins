export type Clickable = React.FunctionComponent<{
    role: 'button',
    tabIndex: 0,
    onClick: (e: React.MouseEvent<HTMLElement>) => void,
}>
export default Clickable;