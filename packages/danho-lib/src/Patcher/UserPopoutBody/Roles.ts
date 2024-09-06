import { Snowflake } from "@discord/types/base";
import { Guild } from "@discord/types/guild";
import { User } from "@discord/types/user";

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