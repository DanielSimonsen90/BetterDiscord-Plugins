import { Finder } from "@dium/api";

export type Clickable = React.FunctionComponent<{
    role: 'button',
    tabIndex: 0,
    onClick: (e: React.MouseEvent<HTMLElement>) => void,
}>
export const Clickable: Clickable = Finder.byName("Clickable");
export default Clickable;