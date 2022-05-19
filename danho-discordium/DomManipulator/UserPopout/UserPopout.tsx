import { UserPopoutReturns } from "danho-discordium/MutationManager/MutationReturns";
import $, { DQuery } from 'danho-discordium/dquery';
import BDFDB from "danho-bd/libraries/BDFDB";
import ZLibrary from "danho-bd/libraries/ZLibrary";
import { User, Channel, Guild, ActivityTypes, UserStatus, GuildMember, PermissionString, DiscordPermissionStrings } from "danho-bd/discord";
import { classNames } from "discordium/modules";
import { React } from 'discordium';

type Props = UserPopoutReturns[0] & {
    get user(): User;
    get member(): GuildMember;
    get channel(): Channel;
    get guild(): Guild;
}

export type UserProfile = User & {
    badges: Array<BadgeProps>,
    status: UserStatus,
    customStatus?: ActivityTypes[4],
    activity?: ActivityTypes[any],
    note?: string
}
export type BadgeProps = {
    ref: DQuery<HTMLDivElement>,
    index: number,
    clickable: {
        ariaLabel: string,
        className: string,
        onBlur: (e: React.FocusEvent) => void,
        onClick: (e: React.MouseEvent) => void,
        onContextMenu: (e: React.MouseEvent) => void,
        onFocus: (e: React.FocusEvent) => void,
        onKeyPress: (e: React.KeyboardEvent) => void,
        onMouseEnter: (e: React.MouseEvent) => void,
        onMouseLeave: (e: React.MouseEvent) => void,
        role: "button",
        tabIndex: 0
    },
    img: {
        alt: ' ',
        ariaHidden: true,
        className: string,
        src: string
    }
}

type AddBadgeProps = {
    clickable: {
        [Key in keyof BadgeProps['clickable'] as 
            Key extends "role" ? never : 
            Key extends "className" ? never : 
            BadgeProps['clickable'][Key] extends string ? Key : never
        ]: BadgeProps['clickable'][Key]
    } & {
        [key in keyof BadgeProps['clickable'] as 
            BadgeProps['clickable'][key] extends Function ? key : 
            key extends "className" ? key :never
        ]?: BadgeProps['clickable'][key]
    },
    img: {
        [Key in keyof BadgeProps['img'] as 
            Key extends "alt" ? never : 
            Key extends "className" ? never : 
            BadgeProps['img'][Key] extends string ? Key : never
        ]: BadgeProps['img'][Key]
    } & {
        className?: string
    }
}


export type GuildProfile = Omit<GuildMember, 'roles' | 'premiumSince'> & {
    roles: Array<any>,
    permissions: Array<PermissionString>,
    owner: boolean,
    boostedSince: Date,
    memberlistIndex: number,
}

export class UserPopoutManipulator {
    constructor(record: MutationRecord, props: UserPopoutReturns[0]) {
        this.rootNode = $(record.target as HTMLElement);
        this.props = {
            ...props,
            get user() {
                return ZLibrary.DiscordModules.UserStore.getUser(props.userId);    
            },
            get member() {
                return ZLibrary.DiscordModules.GuildMemberStore.getMember(props.guildId, props.userId);
            },
            get channel() {
                return ZLibrary.DiscordModules.ChannelStore.getChannel(props.channelId);
            },
            get guild() {
                return ZLibrary.DiscordModules.GuildStore.getGuild(props.guildId);
            }
        }
    }

    private rootNode: DQuery<HTMLElement>;
    public readonly props: Props;

    public get userProfile(): UserProfile {
        return { ...this.props.user,
            badges: this.rootNode.children(s => s.className("profileBadges").className("clickable")).map((ref, index) => ({
                ref, index,
                clickable: { ...ref.props, ariaLabel: ref.props['aria-label'] },
                img: { ...ref.children(null, true).props, ariaHidden: ref.props['aria-hidden'] }
            } as BadgeProps)),
            note: this.rootNode.children(s => s.className("note").tagName("textarea"), true).value,
            status: BDFDB.UserUtils.getStatus(this.props.userId),
            customStatus: BDFDB.UserUtils.getCustomStatus(this.props.userId),
            activity: BDFDB.UserUtils.getActivity(this.props.userId),
        }
    }
    public get guildProfile(): GuildProfile {
        return { ...this.props.member,
            // Update permissions property to something more useful
            roles: this.props.member.roles.map(id => this.props.guild.roles[id]).sort((a, b) => b.position - a.position),
            permissions: Object.keys(DiscordPermissionStrings)
                .map(perm => 
                    BDFDB.UserUtils.can(perm as PermissionString, this.props.userId, this.props.channelId) 
                    && perm as PermissionString
                ).filter(v => v) as Array<PermissionString>,
            owner: this.props.guild.ownerId === this.props.userId,
            boostedSince: new Date(this.props.member.premiumSince),
            memberlistIndex: $(s => s
                .className('membersWrap', 'aside')
                .className('content', 'div').and.role("list").and.ariaLabel("Members")
                .role("listitem", 'div'), false)
                .filter(member => member.attr<true>("data-user-id") === this.props.userId)
                .map(member => member.attr<true>("data-list-item-id")
                    .split('_')
                    .reverse()[0]
                ).map(i => Number(i))[0]
        }
    }

    public addBadge(badge: AddBadgeProps, position?: number) {
        const { clickable, img } = badge;
        const badgeList = this.rootNode.children(s => s.className("profileBadges"), true);

        const Clickable = ({ children, ariaLabel, className, ...handlers }: AddBadgeProps['clickable'] & { children: React.ReactNode }) => (
            <div className={classNames(badgeList.children(null, true).classes, className)} aria-label={ariaLabel}
                role="button" tabIndex={0} {...handlers}
            >
                {children}
            </div>
        );
        const Img = ({ src, className, ...handlers }: AddBadgeProps['img']) => (
            <img alt=' ' aria-hidden={true} src={src} className={classNames(badgeList.children("img", true).classes, className)} {...handlers} />
        );

        const component = (
            <Clickable {...clickable}>
                <Img {...img} />
            </Clickable>
        );
        console.log(component);
        
        return badgeList.appendComponent(component)
    }
}
export default UserPopoutManipulator;