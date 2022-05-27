import { React, ReactDOM, classNames } from 'discordium';
import { User } from '@discord';
import Discord from 'danho-discordium/components/Discord';
import Badge from '../Badge';
import PlusIcon from './PlusIcon';
import BDFDB from '@BDFDB';
import $ from '@dquery';
import ZLibrary from '@ZLibrary';
import { BadgeData, SettingsUser } from 'src/DanhoCustomBadges/Settings/types';

const { UserProfileBadgeList, ClassModules } = Discord;
const { default: BadgeList } = UserProfileBadgeList;
const { useEffect, createRef } = React;

type SettingsBadgeListProps = {
    user: User,
    BDFDB: BDFDB,
    data: SettingsUser,

    onBadgeClick: (badge: BadgeData) => void,
    onAddBadgeClick: () => void,
}


export default function SettingsBadgeList({ user, BDFDB, data: { premiumSince, boosterSince, badges }, onBadgeClick, onAddBadgeClick }: SettingsBadgeListProps) {
    const containerRef = createRef<HTMLDivElement>();

    useEffect(() => {
        if (!containerRef.current) return;
        const children = $(containerRef.current).firstChild.children().map(badge => ({
            tooltipText: badge.element.ariaLabel,
            src: badge.firstChild.attr<true, false>('src'),
            href: badge.firstChild.attr("data-href"),
            id: badge.attr("data-id"),
            isDanhoBadge: badge.classes.includes("danho-badge"),
        })).map(({ isDanhoBadge, ...data }, index) => (
            <Badge key={index} BDFDB={BDFDB} {...data} classNameClickable={isDanhoBadge && "custom"}
                onClick={() => isDanhoBadge && onBadgeClick(badges.find(b => b.id === data.id))}
            />
        ));

        ReactDOM.render((
            <>
                {children}
                <PlusIcon onClick={onAddBadgeClick} />
            </>
        ), containerRef.current.lastElementChild);
    }, [badges, onBadgeClick, BDFDB]);

    return (
        <div className="settings-badge-list-container" ref={containerRef}>
            <BadgeList user={user as User} className='hidden'
                premiumSince={premiumSince ? new Date(premiumSince) : null}
                premiumGuildSince={boosterSince ? new Date(boosterSince) : null}
            />
            <div data-user-id={user.id} className={classNames(
                "settings-badge-list",
                BDFDB.DiscordClassModules.UserBadges.container,
                BDFDB.DiscordClassModules.UserProfileHeader.badgeList
            )}></div>
        </div>
    )
}