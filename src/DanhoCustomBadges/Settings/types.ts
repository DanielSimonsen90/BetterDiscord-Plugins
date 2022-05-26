import { Snowflake } from "@discord"

export const titles: Record<keyof Settings, string> = {
    allowVerified: 'Allow custom Verified badge',
    allowVerifiedInvite: 'When clicking on a Verified badge, open the invite link to the server',
    allowPartneredInvite: 'When clicking on a Partnered badge, open the invite link to the server',
    users: 'Custom badges'
}

export type BadgeData = {
    tooltip: string,
    index: number,
    src: string,
    href?: string
}

export type SettingsUser = {
    badges: Array<BadgeData>
    premiumSince?: string | null,
    boosterSince?: string | null,
}

export type Settings = {
    allowVerified: boolean,
    allowVerifiedInvite: boolean,
    allowPartneredInvite: boolean,
    
    users: {
        [userId: Snowflake]: SettingsUser
    }
}