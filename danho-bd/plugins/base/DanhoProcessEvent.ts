import { Guild, Role, User } from "../../discord";
import { ComponentFiber, ComponentInstance } from "../../libraries/React";
import { BDMutationRecord } from "../../libraries/ZLibrary";

export type DanhoProcessChildListEvent<Props = {}, State = null> = {
    change: BDMutationRecord,
    component: ComponentFiber<Props, State>,
    props: Props,
}
export type DanhoProcessAttributeEvent<Props = {}, State = null> = DanhoProcessChildListEvent<Props, State> & {
    attributeName: string,
    oldValue?: string,
}

export type RoleInstance = ComponentInstance<{
    canRemove: boolean,
    guildId: string,
    onRemove: () => void,
    role: Role,
}, true> & {
    /** Role id */
    key: string,
    ref: { current: HTMLDivElement },
}

export type RolesListComponent = ComponentInstance<{
    "aria-labels": "Roles",
    children: [
        // Roles
        RoleInstance,
        // Add Role button
        ComponentInstance<{
            className: string,
            guild: Guild,
            handleAddRole: (role: Role) => void,
            user: User,
            userRoles: Array<string>
        }>
    ],
    "data-list-id": string,
    onKeyDown: (e: KeyboardEvent) => void,
    role: "list",
    tabIndex: number
}>
