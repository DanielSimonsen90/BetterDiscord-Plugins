import { UserPopoutManipulator } from "danho-discordium/DomManipulator/UserPopout";

export type UserPopoutReturns = [props: UserPopoutProps, manipulator: UserPopoutManipulator]
export default UserPopoutReturns;

export type UserPopoutProps = {
    channelId: string,
    closePopout: () => void,
    guildId?: string,
    isPositioned: boolean,
    nudge: number,
    position: 'left' | 'right',
    setPopoutRef: (e: any) => void,
    updatePosition: () => void,
    userId: string
}