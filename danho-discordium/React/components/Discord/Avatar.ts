import { Finder } from "@discordium/api";

type Sizes = `SIZE_${16 | 20 | 24 | 32 | 40 | 56 | 80 | 120}`;
type AnyNull = any | null;
enum StatusTypes { DND, IDLE, INVISIBLE, OFFLINE, ONLINE, STEAMING, UNKNOWN }

type AvatarComponent = React.FunctionComponent<{
    src: string,
    status?: string,
    statusColor?: string,
    className?: string,
    size: Sizes,
    
    isMobile?: boolean,
    isTyping?: boolean,
    tabIndex?: number,
    avatarDecoration?: string,

    "aria-hidden"?: boolean,
    "aria-label"?: string,

    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void,
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void,
}>

export interface Avatar extends AvatarComponent {
    AnimatedAvatar: React.FunctionComponent<{
        statusColor: string;
        status: string;
        isMobile?: boolean;
        isTyping?: boolean;
    }>,
    default: AvatarComponent,
    Sizes: Record<Sizes, Sizes>,
    determineIsAnimated(e: AnyNull, t: StatusTypes | null, n: AnyNull, r: AnyNull, i: AnyNull): boolean
}
export const Avatar: Avatar = Finder.byProps("AnimatedAvatar");
export default Avatar;