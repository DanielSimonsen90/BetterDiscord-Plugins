// @ts-nocheck

import { Discord } from "discordium/src";
import { ComponentFiber, ComponentInstance } from "@lib/React";
import { BDMutationRecord } from "@ZLibrary";

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
    role: Discord.Role,
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
            guild: Discord.Guild,
            handleAddRole: (role: Discord.Role) => void,
            user: Discord.User,
            userRoles: Array<string>
        }>
    ],
    "data-list-id": string,
    onKeyDown: (e: KeyboardEvent) => void,
    role: "list",
    tabIndex: number
}>
