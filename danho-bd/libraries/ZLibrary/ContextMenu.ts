type OnClickEventHandler = (event: MouseEvent) => void;
type BaseContextMenuItemProps = {
    label: string,
    closeOnClick?: boolean,
    danger?: boolean,
    disabled?: boolean,
    hint?: string,
    icon?: Function,
    id?: string,
    image?: string,
    subtext?: string,
    render?: Function,
    style?: object,
    action?: OnClickEventHandler,
    onClick?: OnClickEventHandler,
    onClose?: () => void,
}
type ContextMenuProps = {
    group: BaseContextMenuItemProps & {
        type: "group"
        items: Array<ContextMenuProps[keyof ContextMenuProps]>
    },
    toggle: BaseContextMenuItemProps & {
        type: "toggle",
        checked?: boolean,
        active?: boolean
    },
    radio: BaseContextMenuItemProps & {
        type: "radio",
        checked?: boolean,
        active?: boolean,
        forceUpdate?: boolean
    },
    submenu: BaseContextMenuItemProps & {
        type: "submenu",
        render?: Array<React.Component>,
        items?: Array<ContextMenuProps[keyof ContextMenuProps]>,
        children?: Array<React.Component>,
    },
    custom: BaseContextMenuItemProps & {
        type: "custom",
        control?: Function
    },
    text: BaseContextMenuItemProps,
    seperator: BaseContextMenuItemProps
}

type ContextMenuComponent<Props extends BaseContextMenuItemProps> = React.Component<Props>;

export type ContextMenu = {
    buildMenuItem<Type extends keyof ContextMenuProps>(props: ContextMenuProps[Type]): ContextMenuComponent<ContextMenuProps[Type]>,
    buildMenuChildren(...items: Array<ContextMenuProps[keyof ContextMenuProps]>): Array<ContextMenuProps[keyof ContextMenuProps]>,
    buildMenu(...items: Array<BaseContextMenuItemProps>): ContextMenuComponent<{ items: Array<BaseContextMenuItemProps>, label: string }>,
    openContextMenu(event: MouseEvent, menuComponent: ContextMenuComponent<any>, config: {
        position?: 'top' | 'bottom' | 'left' | 'right',
        align?: 'top' | 'bottom',
        onClose?: () => void,
        noBlurEvent?: boolean
    }): void,
    getDiscordMenu(nameOrFilter: string | Function): Promise<ContextMenuComponent<any>>,
    forceUpdateMenus(): void
}
export default ContextMenu;