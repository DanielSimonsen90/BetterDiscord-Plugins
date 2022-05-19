import { UserPopoutManipulator } from "danho-discordium/DomManipulator/UserPopout";

export type UserPopoutReturns = [props: {
    channelId: string,
    closePopout: () => void,
    guildId?: string,
    isPositioned: boolean,
    nudge: number,
    position: 'left' | 'right',
    setPopoutRef: (e: any) => void,
    updatePosition: () => void,
    userId: string
}, manipulator: UserPopoutManipulator]
export default UserPopoutReturns;