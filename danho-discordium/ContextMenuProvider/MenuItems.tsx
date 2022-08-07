import { React } from 'discordium';
import { Menu } from "@discordium/modules";

const { MenuGroup, MenuItem } = Menu;

export function Group(props: GroupProps) {
    return <MenuGroup {...props} />;
}
export function Item(props: ItemProps) {
    return <MenuItem {...props} />;
}

type GroupProps = {
    children: React.ReactNode
}
type ItemProps = {
    label: string
    id: string
    action: () => void
}

// Should check out the ZLibrary ContextMenu file