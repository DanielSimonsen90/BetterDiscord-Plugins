import { Menu } from "@discordium/modules";
import React from "@react";

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