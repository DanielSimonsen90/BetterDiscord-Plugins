import { Guild, User, Snowflake } from "@discord"
import { RoleReturns } from "danho-discordium/MutationManager/MutationReturns"

export type RolesSection = {
    children: [
        eyebrow: React.ReactElement<RoleEyebrow>,
        roles: React.ReactElement<Roles>
    ]
}

export type RoleEyebrow = {
    children: "Roles",
    className: string,
    color: string,
    level: number,
    variant: "eyebrow"
}
export type Roles = {
    className: string,
    guild: Guild,
    user: User,
    userRoles: Array<Snowflake>
}
export type Role = RoleReturns[0]