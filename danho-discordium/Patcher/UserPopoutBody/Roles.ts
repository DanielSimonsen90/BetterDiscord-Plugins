import { Guild, User, Snowflake } from "@discord"

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