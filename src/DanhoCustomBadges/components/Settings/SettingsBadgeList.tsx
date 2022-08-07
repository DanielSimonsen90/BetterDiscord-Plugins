import { User } from '@discord';
import Badge from '../Badge';
import PlusIcon from './PlusIcon';
import BDFDB from '@BDFDB';
import { BadgeData, SettingsUser } from 'src/DanhoCustomBadges/Settings/types';

const { React, ReactDOM, DanhoModules } = window.BDD.Modules;
const { useEffect, createRef } = React;
const { $, CompiledReact } = DanhoModules;
const { classNames, Components } = CompiledReact;
const { UserProfileBadgeList } = Components.Discord;
const { default: BadgeList } = UserProfileBadgeList;

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
            src: badge.firstChild?.attr<true, false>('src'),
            href: badge.firstChild?.attr("data-href"),
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
    }, [containerRef.current, badges, onBadgeClick, BDFDB]);

    return (
        <div className="settings-badge-list-container" ref={containerRef}>
            <BadgeList user={user as User} className={`hidden data-user-id-${user.id}`} // using classes because component ignores additional props
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